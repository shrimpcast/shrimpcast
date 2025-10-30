using Hangfire;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;
using System.Diagnostics;
using System.Text.Json.Nodes;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class FFMPEGRepository(IMediaServerStreamRepository mediaServerStreamRepository, Processes<SiteHub> processes, MediaServerLogs<SiteHub> mediaServerLogs) : IFFMPEGRepository
    {
        private readonly IMediaServerStreamRepository _mediaServerStreamRepository = mediaServerStreamRepository;
        private readonly Processes<SiteHub> _processes = processes;
        private readonly MediaServerLogs<SiteHub> _mediaServerLogs = mediaServerLogs;
        private const string FFMPEGProcess = "ffmpeg"; 
        private const string FFProbeProcess = "ffprobe"; 
        private const string StreamsPath = "streams"; 

        public async Task InitStreamProcesses()
        {
            MediaServerLog($"Starting processes...");
            KillAllProcesses();
            var streams = await _mediaServerStreamRepository.GetEnabled();
            foreach (var stream in streams) InitStreamProcess(stream, "system");
        }

        public void InitStreamProcess(MediaServerStream stream, string StartedBy)
        {
            try
            {
                CleanStreamDirectory(stream.Name);
                var streamInfo = BuildStreamCommand(stream);

                streamInfo.Process.OutputDataReceived += async (_, e) => await LogFfmpeg(stream.Name, e);
                streamInfo.Process.ErrorDataReceived += async (_, e) => await LogFfmpeg(stream.Name, e);
                streamInfo.Process.Exited += (sender, e) => BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));

                streamInfo.Process.Start();
                streamInfo.Process.BeginOutputReadLine();
                streamInfo.Process.BeginErrorReadLine();

                _processes.All.AddOrUpdate(stream.Name, streamInfo, (k, oldValue) => streamInfo);
                MediaServerLog($"Started process {stream.Name}. Started by {StartedBy}");
            }
            catch (Exception)
            {
                BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));
            }
        }

        public async Task<bool> StopStreamProcess(string stream, string reason)
        {
            _processes.All.TryGetValue(stream, out var processInfo);
            if (processInfo == null || processInfo.Process.HasExited) return false;
            MediaServerLog($"Stop called on process {stream}. Reason = {reason}");
            processInfo.Process.Kill(true);
            await processInfo.Process.WaitForExitAsync();
            return true;
        }

        public async Task LogFfmpeg(string stream, DataReceivedEventArgs e)
        {
            _processes.All.TryGetValue(stream, out var streamInfo);
            if (streamInfo == null || e.Data == null) return;
            if (streamInfo.Logs.Count >= 200) streamInfo.Logs.TryDequeue(out _);

            var now = DateTime.UtcNow;
            streamInfo.Logs.Enqueue((DateTime.UtcNow, e.Data));

            var lastScreenshotTime = streamInfo.LastScreenshot;
            if (lastScreenshotTime == null || (now - lastScreenshotTime).Value.TotalSeconds >= streamInfo.Stream.SnapshotInterval)
            {
                string? screenshotCommand = BuildScreenshotCommand(stream);
                if (screenshotCommand == null) return;
                streamInfo.LastScreenshot = DateTime.UtcNow;
                MediaServerLog($"Capturing snapshot for {stream}");
                await LaunchProcess(FFMPEGProcess, screenshotCommand);
            }
        }

        private void MediaServerLog(string logContent)
        {
            if (_mediaServerLogs.Logs.Count >= 200) _mediaServerLogs.Logs.TryDequeue(out _);
            _mediaServerLogs.Logs.Enqueue((DateTime.UtcNow, logContent));
        }

        public async Task<JsonNode?> Probe(string? Headers, string URL)
        {
            var command = BuildProbeCommand(Headers, URL);
            try
            {
                var probe = await LaunchProcess(FFProbeProcess, command, ReturnOutput: true);
                return JsonNode.Parse(probe);
            }
            catch (Exception)
            {
                return $"Error: Probe failed ({FFProbeProcess} {command})";
            }
        }

        public async Task<string> LaunchProcess(string FileName, string Arguments, string SuccessMessage = "", bool ReturnOutput = true)
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

        public async Task ShouldRestartStream(string Name)
        {
            var restartWaitMs = 1000;
            await Task.Delay(restartWaitMs);
            MediaServerLog($"Process {Name} exited.");
            CleanStreamDirectory(Name);

            var updatedStream = await _mediaServerStreamRepository.GetByName(Name);
            if (updatedStream != null && updatedStream.IsEnabled)
            {
                MediaServerLog($"Attempting to restart {Name}");
                InitStreamProcess(updatedStream, "restart attempt.");
            }
            else _processes.All.TryRemove(Name, out _);
        }

        public async Task CheckForStaleProcesses()
        {
            var MaxStaleTimeInSeconds = 15;
            var UtcNow = DateTime.UtcNow;
            var AllProcessesOk = true;

            foreach (var process in _processes.All.Values)
            {
                var (AddedAt, Content) = process.Logs.LastOrDefault();
                if (process.Process.HasExited || Content == null) continue;
                if ((UtcNow - AddedAt).TotalSeconds > MaxStaleTimeInSeconds)
                {
                    await StopStreamProcess(process.Stream.Name, "stale");
                    AllProcessesOk = false;
                }
            }
            if (AllProcessesOk) MediaServerLog("Checked for stale processes. All procesess are running correctly.");
            BackgroundJob.Schedule(() => CheckForStaleProcesses(), TimeSpan.FromSeconds(MaxStaleTimeInSeconds));
        }

        private void KillAllProcesses()
        {
            foreach (var process in Process.GetProcessesByName(FFMPEGProcess)) process.Kill(true);
            CleanStreamDirectory(CleanRoot: true);
        }

        public bool IsDevelopment () =>
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        private string GetStreamPath(string stream) =>
            IsDevelopment() ? $"/api/mediaserver/{StreamsPath}/{stream}/index.m3u8"
                            : $"/{StreamsPath}/{stream}/index.m3u8";

        private string GetBaseDirectory() =>
            IsDevelopment() ? Path.Combine(Directory.GetCurrentDirectory(), StreamsPath)
                            : $"wwwroot\\{StreamsPath}";

        public string GetStreamDirectory(string Name) =>
            $"{GetBaseDirectory()}\\{Name.ToLower()}";

        private void CleanStreamDirectory(string Name = "", bool CleanRoot = false)
        {
            try
            {
                var dir = CleanRoot ? GetBaseDirectory() : GetStreamDirectory(Name);
                Directory.Delete(dir, true);
            } catch (Exception) { }
        }

        private string BuildProbeCommand(string? Headers, string URL)
        {
            var command = $"-v quiet -print_format json -show_format -show_streams";

            if (!string.IsNullOrEmpty(Headers)) command += $" -headers \"{Headers}\"";
            command += $" -i {URL}";

            return command;
        }

        public string? BuildScreenshotCommand(string streamName)
        {
            var streamDir = GetStreamDirectory(streamName);
            var playlist = $"{streamDir}\\index.m3u8";
            if (!File.Exists(playlist)) return null;
            var command = $" -y -i \"{playlist}\" -frames:v 1 -q:v 2 \"{streamDir}\\index.jpg\"";
            return command;
        }

        private StreamInfo BuildStreamCommand(MediaServerStream stream)
        {
            var audioIndexSource = string.IsNullOrEmpty(stream.AudioCustomSource) ? 0 : 1;
            var command = "-loglevel info -y -fflags +genpts";

            if (stream.CustomHeaders != "\r\n") command += $" -headers \"{stream.CustomHeaders}\"";

            command += $" -re -i \"{stream.IngressUri}\"";

            if (audioIndexSource == 1)
            {
                if (stream.CustomAudioHeaders != "\r\n") command += $" -headers \"{stream.CustomAudioHeaders}\"";
                command += $" -fflags +genpts -re -i \"{stream.AudioCustomSource}\"";
            }

            command += $" -map 0:{stream.VideoStreamIndex}";
            if (stream.VideoEncodingPreset == "PASSTHROUGH") command += " -codec:v copy";

            if (stream.AudioStreamIndex != null)
            {
                command += $" -map {audioIndexSource}:{stream.AudioStreamIndex}";
                if (stream.AudioEncodingPreset == "PASSTHROUGH") command += $" -codec:a copy";
            }
            else command += " -an";

            if (stream.LowLatency) command += " -flags +low_delay";

            var dirInfo = Directory.CreateDirectory(GetStreamDirectory(stream.Name));
            command += $" -f hls -hls_time {stream.SegmentLength} -hls_list_size {stream.ListSize} -hls_flags delete_segments+append_list+program_date_time -hls_segment_filename \"{dirInfo.FullName}\\live_%03d.ts\" {dirInfo.FullName}\\index.m3u8";

            return new StreamInfo
            {
                LaunchCommand = $"{FFMPEGProcess} {command}",
                StreamPath = GetStreamPath(stream.Name.ToLower()),
                Stream = stream,
                Process = MakeProcess(FFMPEGProcess, command, true)
            };
        }
    }
}
