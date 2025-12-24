using Hangfire;
using Newtonsoft.Json;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;
using System.Diagnostics;
using System.Text;
using System.Text.Json.Nodes;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class FFMPEGRepository(IMediaServerStreamRepository mediaServerStreamRepository, Processes<SiteHub> processes, MediaServerLogs<SiteHub> mediaServerLogs, ConfigurationSingleton configurationSingleton, RateLimits<SiteHub> rateLimits) : IFFMPEGRepository
    {
        private readonly IMediaServerStreamRepository _mediaServerStreamRepository = mediaServerStreamRepository;
        private readonly Processes<SiteHub> _processes = processes;
        private readonly MediaServerLogs<SiteHub> _mediaServerLogs = mediaServerLogs;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        private readonly RateLimits<SiteHub> _rateLimits = rateLimits;
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

                streamInfo.Process.OutputDataReceived += (_, e) => LogFfmpeg(stream.Name, e?.Data);
                streamInfo.Process.ErrorDataReceived += (_, e) => LogFfmpeg(stream.Name, e?.Data);
                streamInfo.Process.Exited += (sender, e) => LogProcessCrash(stream.Name);

                streamInfo.Process.Start();
                streamInfo.Process.BeginOutputReadLine();
                streamInfo.Process.BeginErrorReadLine();

                _processes.All.AddOrUpdate(stream.Name, streamInfo, (k, oldValue) => streamInfo);
                MediaServerLog($"Started process {stream.Name}. Started by {StartedBy}");
            }
            catch (Exception ex)
            {
                MediaServerLog($"Could not start process {stream.Name}. {ex.Message}");
                BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));
            }
        }

        public async Task<bool> StopStreamProcess(string stream, string reason)
        {
            _processes.All.TryGetValue(stream, out var processInfo);
            if (processInfo == null || HasExited(processInfo.Process)) return false;
            MediaServerLog($"Stop called on process {stream}. Reason = {reason}");
            if (reason != "stale") processInfo.Stream.IsEnabled = false;
            try
            {
                processInfo.Process.Kill(true);
                await processInfo.Process.WaitForExitAsync();
                CleanStreamDirectory(stream);
                MediaServerLog($"Stopped process {stream}");
            }
            catch (Exception ex)
            {
                MediaServerLog($"ERROR: Could not stop {stream}. {ex.Message}");
            }
            return true;
        }

        public void LogFfmpeg(string stream, string? log)
        {
            _processes.All.TryGetValue(stream, out var streamInfo);
            if (streamInfo == null || log == null) return;
            if (streamInfo.Logs.Count >= 200) streamInfo.Logs.TryDequeue(out _);
            streamInfo.Logs.Enqueue((DateTime.UtcNow, log.Trim()));
        }

        private void LogProcessCrash(string streamName)
        {
            _processes.All.TryGetValue(streamName, out var streamInfo);
            var reason = string.Empty;
            MediaServerLog($"=============== BEGIN EXIT REPORT ===============");
            MediaServerLog($"Process {streamName} exited");
            if (streamInfo != null)
            {

                MediaServerLog($"Duration: {TimeSpan.FromSeconds((int)(DateTime.UtcNow - streamInfo.StartTime).TotalSeconds)}");
                MediaServerLog($"Last 5 logs: [{string.Join(",", streamInfo.Logs.TakeLast(5).Select(l => (l.AddedAt, l.Content.Trim())))}]");
            }
            MediaServerLog($"=============== END EXIT REPORT ===============");
        }

        private void MediaServerLog(string logContent)
        {
            if (_mediaServerLogs.Logs.Count >= 300) _mediaServerLogs.Logs.TryDequeue(out _);
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
            var updatedStream = await _mediaServerStreamRepository.GetByName(Name);
            if (updatedStream != null && updatedStream.IsEnabled)
            {
                MediaServerLog($"Attempting to restart {Name}");
                InitStreamProcess(updatedStream, "restart attempt.");
            }
            else _processes.All.TryRemove(Name, out _);
        }

        public async Task DoBackgroundTasks()
        {
            var now = DateTime.UtcNow;
            var MaxStaleTimeInSeconds = 12;

            try
            {
                foreach (var streamInfo in _processes.All.Values)
                {
                    var stream = streamInfo.Stream;

                    // ------ check if process is stale ------ //
                    var (AddedAt, Content) = streamInfo.Logs.LastOrDefault();
                    if (Content != null && ((now - AddedAt).TotalSeconds > MaxStaleTimeInSeconds))
                    {
                        await StopStreamProcess(stream.Name, "stale");
                    }

                    // ------ check if process has exited and should be restarted ------ //
                    if (HasExited(streamInfo.Process))
                    {
                        BackgroundJob.Enqueue(() => ShouldRestartStream(stream.Name));
                        continue;
                    }

                    // ------ calculate process CPU usage ------ //
                    try
                    {
                        if (streamInfo.ProcessorUsage != null)
                        {
                            var currentCpu = streamInfo.Process.TotalProcessorTime;
                            var curTime = DateTime.UtcNow;

                            double cpuUsedMs = (currentCpu - streamInfo.ProcessorUsage.Value.CpuTime).TotalMilliseconds;
                            double totalMsPassed = (curTime - streamInfo.ProcessorUsage.Value.Time).TotalMilliseconds;

                            double cpuUsageTotal = cpuUsedMs / (Environment.ProcessorCount * totalMsPassed) * 100;

                            streamInfo.ProcessorUsageComputed = $"CPU: {cpuUsageTotal:F2}%";
                        }
                        streamInfo.ProcessorUsage = (streamInfo.Process.TotalProcessorTime, DateTime.UtcNow);
                    }
                    catch (Exception)
                    {
                        MediaServerLog($"Error logging CPU time for {stream.Name}");
                    }

                    // ------ calculate stream bitrate ------ //
                    streamInfo.Bitrate = GetStreamBitrate(stream.Name, streamInfo.Stream.SegmentLength);

                    // ------ generate thumbnail ------ //
                    var lastScreenshotTime = streamInfo.LastScreenshot;
                    if (lastScreenshotTime != null && (now - lastScreenshotTime).Value.TotalSeconds < stream.SnapshotInterval) continue;

                    string? screenshotCommand = BuildScreenshotCommand(stream.Name);
                    if (screenshotCommand == null) continue;

                    try
                    {
                        var captured = await LaunchProcess(FFMPEGProcess, screenshotCommand, "Success", false);
                        if (captured == "Success")
                        {
                            streamInfo.LastScreenshot = now;
                            MediaServerLog($"Captured snapshot for {stream.Name}");
                        }
                    }
                    catch (Exception ex)
                    {
                        MediaServerLog($"Could not capture snapshot for {stream.Name}. {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                MediaServerLog($"Could not execute background processes: {ex.Message}");
            }

            BackgroundJob.Schedule(() => DoBackgroundTasks(), TimeSpan.FromSeconds(3));
        }

        public Process[] GetActiveFFMPEGProcesses() =>
            Process.GetProcessesByName(FFMPEGProcess);

        public void KillAllProcesses()
        {
            foreach (var process in GetActiveFFMPEGProcesses()) process.Kill(true);
            CleanStreamDirectory(CleanRoot: true);
        }

        public bool IsDevelopment() =>
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        public async Task SendInstanceMetrics()
        {
            if (_configurationSingleton.Configuration.LbSendInstanceMetrics) await ReportMetrics();
            BackgroundJob.Schedule(() => SendInstanceMetrics(), TimeSpan.FromSeconds(3));
        }

        public void RemoveStaleViewers()
        {
            _rateLimits.CleanupIfNeeded();

            var now = DateTime.UtcNow;
            foreach (var process in _processes.All)
            {
                var toRemove = process.Value.Viewers.Where(v => (now - v.Value).TotalSeconds > 15);
                foreach (var item in toRemove)
                {
                    process.Value.Viewers.TryRemove(item);
                }
            }

            BackgroundJob.Schedule(() => RemoveStaleViewers(), TimeSpan.FromSeconds(15));
        }

        private async Task ReportMetrics()
        {
            try
            {
                var config = _configurationSingleton.Configuration;
                var url = $"https://{config.LbTargetDomain}/api/mediaserver/SendInstanceMetrics";

                var metrics = new LBMetric
                {
                    InstanceName = config.StreamTitle,
                    Metrics = new SystemStats().GetStats(_processes.All.Values.Sum(p => p.Viewers.Count)),
                };

                var handler = IsDevelopment() ? new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                } : new HttpClientHandler();

                using var client = new HttpClient(handler)
                {
                    Timeout = TimeSpan.FromSeconds(3)
                };

                client.DefaultRequestHeaders.Add("User-Agent", $"shrimpcast/{Constants.BACKEND_VERSION}");
                client.DefaultRequestHeaders.Add("Auth-Token", config.LbAuthToken);
                var content = new StringContent(JsonConvert.SerializeObject(metrics), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                MediaServerLog($"Could not report instance metrics: {ex.Message}");
            }
        }

        private string GetWebStreamPath(string stream) => $"/api/mediaserver/{StreamsPath}/{stream}/index.m3u8";

        private string GetBaseDirectory() =>
            Path.Combine(Directory.GetCurrentDirectory(), StreamsPath);

        public string GetStreamDirectory(string Name) =>
            Path.Combine(GetBaseDirectory(), Name.ToLower());

        private void CleanStreamDirectory(string Name = "", bool CleanRoot = false)
        {
            try
            {
                var dir = CleanRoot ? GetBaseDirectory() : GetStreamDirectory(Name);
                Directory.Delete(dir, true);
            }
            catch (Exception) { }
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
            var playlist = Path.Combine(streamDir, "index.m3u8");
            if (!File.Exists(playlist)) return null;
            var command = $" -y -i \"{playlist}\" -frames:v 1 -q:v 2 \"{Path.Combine(streamDir, "index.jpg")}\"";
            return command;
        }

        private StreamInfo BuildStreamCommand(MediaServerStream stream)
        {
            var audioIndexSource = string.IsNullOrEmpty(stream.AudioCustomSource) ? 0 : 1;
            var command = "-loglevel info -y -fflags +genpts -thread_queue_size 512";
            var shouldSeek = stream.StartAt != null && stream.StartAt.Value.ToString() != "00:00:00" ? $"-ss {stream.StartAt.Value}" : string.Empty;

            if (stream.CustomHeaders != "\r\n") command += $" -headers \"{stream.CustomHeaders}\"";

            command += $" -re -rw_timeout 5000000 {shouldSeek} -i \"{stream.IngressUri}\"{(!string.IsNullOrEmpty(shouldSeek) ? " -copyts" : "")}";

            var isPassthrough = stream.VideoEncodingPreset == "PASSTHROUGH";
            var hasWatermark = !isPassthrough && !string.IsNullOrEmpty(stream.Watermark);
            var hasSubtitles = !isPassthrough && !string.IsNullOrEmpty(stream.Subtitles);

            if (hasWatermark)
            {
                command += $" -i \"{stream.Watermark}\"";
                if (audioIndexSource > 0) audioIndexSource++;
            }

            if (audioIndexSource > 0)
            {
                if (stream.CustomAudioHeaders != "\r\n") command += $" -headers \"{stream.CustomAudioHeaders}\"";
                command += $" -fflags +genpts -thread_queue_size 512 -re -rw_timeout 5000000 -i \"{stream.AudioCustomSource}\"";
            }

            var videoMap = $"0:{stream.VideoStreamIndex}";

            if (hasWatermark || hasSubtitles)
            {
                var subs = string.Empty;
                if (hasSubtitles)
                {
                    subs = $"subtitles='{stream.Subtitles!.Replace(@"\", "/").Replace(":", @"\:")}'";
                }

                command += $" -filter_complex ";
                if (hasWatermark && hasSubtitles)
                {
                    command += $"\"[{videoMap}][1:v]overlay=W-w-10:10[vw];[vw]{subs}[v]\"";
                }
                else
                {
                    if (hasWatermark) command += $"\"[{videoMap}][1:v]overlay=W-w-10:10[v]\"";
                    if (hasSubtitles) command += $"\"[{videoMap}]{subs}[v]\"";
                }

                command += " -map \"[v]\"";
            }
            else command += $" -map {videoMap}";

            if (isPassthrough) command += " -codec:v copy";
            else
            {
                var bitrate = stream.VideoTranscodingBitrate;
                command += $" -codec:v libx264 -preset:v {stream.VideoTranscodingPreset} -b:v {bitrate}k -maxrate:v {bitrate}k -bufsize:v {bitrate}k -r {stream.VideoTranscodingFramerate} -sc_threshold 0 -pix_fmt yuv420p -g 120 -keyint_min 120 -fps_mode auto -tune:v zerolatency";
            }

            if (stream.AudioStreamIndex != null)
            {
                command += $" -map {audioIndexSource}:{stream.AudioStreamIndex}";
                if (stream.AudioEncodingPreset == "PASSTHROUGH") command += $" -codec:a copy";
                else
                {
                    var loudNorm = stream.AudioTranscodingLoudnessNormalization ? ",loudnorm" : string.Empty;
                    var volume = stream.AudioTranscodingVolume != -1 ? $",volume=volume={stream.AudioTranscodingVolume}dB" : string.Empty;
                    command += $" -filter:a aresample=osr=44100:ochl=stereo{volume}{loudNorm} -codec:a aac -b:a {stream.AudioAACBitrate}k -shortest -bsf:a aac_adtstoasc";
                }
            }
            else command += " -an";

            if (stream.LowLatency) command += " -flags +low_delay";

            var dirInfo = Directory.CreateDirectory(GetStreamDirectory(stream.Name));
            command += $" -f hls -hls_time {stream.SegmentLength} -hls_list_size {stream.ListSize} -hls_flags delete_segments+append_list+program_date_time+temp_file -hls_delete_threshold 4 -hls_segment_filename \"{Path.Combine(dirInfo.FullName, "live_%03d.ts")}\" {Path.Combine(dirInfo.FullName, "index.m3u8")}";

            return new StreamInfo
            {
                LaunchCommand = $"{FFMPEGProcess} {command}",
                StreamPath = GetWebStreamPath(stream.Name.ToLower()),
                FullStreamPath = Path.Combine(dirInfo.FullName, "index.m3u8"),
                Stream = stream,
                Process = MakeProcess(FFMPEGProcess, command, true),
                StartTime = DateTime.UtcNow,
            };
        }

        private int GetStreamBitrate(string StreamName, int segmentDuration)
        {
            try
            {
                var dir = GetStreamDirectory(StreamName);
                var tsFiles = Directory.GetFiles(dir, "*.ts", SearchOption.TopDirectoryOnly);
                if (tsFiles.Length == 0) return 0;
                long totalBytes = tsFiles.Sum(f => new FileInfo(f).Length);
                double totalSeconds = tsFiles.Length * segmentDuration;
                double bitrateBps = totalBytes * 8 / totalSeconds;
                double bitrateKbps = bitrateBps / 1000;
                return (int)bitrateKbps;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public bool HasExited(Process process)
        {
            try
            {
                return process.HasExited;
            }
            // Linux
            catch (Exception)
            {
                return true;
            }
        }
    }
}
