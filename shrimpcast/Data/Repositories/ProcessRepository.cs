using Hangfire;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;
using System.Diagnostics;
using System.IO;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class ProcessRepository : IProcessRepository
    {
        private readonly IMediaServerStreamRepository _mediaServerStreamRepository;
        private readonly ConfigurationSingleton _configurationSingleton;
        private readonly Processes<SiteHub> _processes;

        public ProcessRepository(
            IMediaServerStreamRepository mediaServerStreamRepository,
            ConfigurationSingleton configurationSingleton,
            Processes<SiteHub> processes)
        {
            _mediaServerStreamRepository = mediaServerStreamRepository;
            _configurationSingleton = configurationSingleton;
            _processes = processes;
        }

        public async Task InitStreamProcesses()
        {
            FFMPEGHelper.KillAllProcesses();
            var streams = await _mediaServerStreamRepository.GetEnabled();
            foreach (var stream in streams) InitStreamProcess(stream);
        }

        public void InitStreamProcess(MediaServerStream stream)
        {
            try
            {
                var streamInfo = FFMPEGHelper.BuildStreamCommand(stream);

                streamInfo.Process.OutputDataReceived += (_, e) => Log(stream.Name, e);
                streamInfo.Process.ErrorDataReceived += (_, e) => Log(stream.Name, e);
                streamInfo.Process.Exited += (sender, e) => BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));

                streamInfo.Process.Start();
                streamInfo.Process.BeginOutputReadLine();
                streamInfo.Process.BeginErrorReadLine();

                _processes.All.AddOrUpdate(stream.Name, streamInfo, (k, oldValue) => streamInfo);
            }
            catch (Exception)
            {
                BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));
            }
        }

        public async Task<bool> StopStreamProcess(string stream)
        {
            _processes.All.TryGetValue(stream, out var processInfo);
            if (processInfo == null || processInfo.Process.HasExited) return false;
            processInfo.Process.Kill(true);
            await processInfo.Process.WaitForExitAsync();
            _processes.All.TryRemove(stream, out _);
            return true;
        }

        public async Task ShouldRestartStream(string Name)
        {
            FFMPEGHelper.CleanStreamDir(Name);
            var updatedStream = await _mediaServerStreamRepository.GetByName(Name);
            await Task.Delay(1000);
            if (updatedStream != null && updatedStream.IsEnabled) InitStreamProcess(updatedStream);
            else _processes.All.TryRemove(Name, out _);
        }

        public void Log(string stream, DataReceivedEventArgs e)
        {
            _processes.All.TryGetValue(stream, out var streamInfo);
            if (streamInfo == null || e.Data == null) return;
            if (streamInfo.Logs.Count >= 200) streamInfo.Logs.TryDequeue(out _);
            streamInfo.Logs.Enqueue((DateTime.UtcNow, e.Data));
        }

        public async Task<string> ExecSingleInstanceProcess(string FileName, string Arguments, string SuccessMessage = "", bool ReturnOutput = true)
        {
            using var process = MakeProcess(FileName, Arguments, false);
            process.Start();

            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            if (process.ExitCode == 0) return ReturnOutput ? await outputTask : SuccessMessage;
            else return $"Error output: {await errorTask}";
        }

        public static Process MakeProcess(string FileName, string Arguments, bool RaisingEvents) =>
            new()
            {
                StartInfo = new ProcessStartInfo
                {
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    FileName = FileName,
                    Arguments = Arguments,
                },
                EnableRaisingEvents = RaisingEvents
            };
    }
}
