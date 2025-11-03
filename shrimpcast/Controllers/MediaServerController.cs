using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DTO;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class MediaServerController(IFFMPEGRepository ffmpegRepository, IRTMPEndpointRepository rtmpEndpointRepository, ISessionRepository sessionRepository, Processes<SiteHub> processes, MediaServerLogs<SiteHub> mediaServerLogs) : ControllerBase
    {
        private readonly IFFMPEGRepository _ffmpegRepository = ffmpegRepository;
        private readonly IRTMPEndpointRepository _rtmpEndpointRepository = rtmpEndpointRepository;
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly Processes<SiteHub> _processes = processes;
        private readonly MediaServerLogs<SiteHub> _mediaServerLogs = mediaServerLogs;

        [HttpGet, Route("GetSystemStats")]
        public async Task<object> GetSystemStats(string sessionToken)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");

            var systemStats = new SystemStats();
            var cpuUsage = systemStats.GetCpuUsage();
            var memoryUsage = systemStats.GetMemoryUsagePercentage();
            var networkUsage = systemStats.GetNetworkUsage();
            return new
            {
                cpu = new { numeric = cpuUsage, _string = $"{cpuUsage:F2}%" },
                memory = new { numeric = memoryUsage, _string = $"{memoryUsage:F2}%" },
                network = new { numeric = networkUsage, _string = $"{networkUsage:F2}mbps" },
            };
        }

        [HttpGet, Route("GetStreamStats")]
        public async Task<object> GetStreamStats(string sessionToken)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            return _processes.All.Select(p => new
            {
                name = p.Key,
                rawJsonSettings = new
                {
                    stream = p.Value.Stream,
                    launchCommand = p.Value.LaunchCommand,
                },
                streamUrl = p.Value.StreamPath,
                processStatus = new
                {
                    runningStatus = !p.Value.Stream.IsEnabled ? "Stopping"
                                     : _ffmpegRepository.HasExited(p.Value.Process)
                                        ? "Starting"
                                        : System.IO.File.Exists(p.Value.FullStreamPath) ? "Connected" : "Connecting",
                    runningTime = TimeSpan.FromSeconds((int)(DateTime.UtcNow - p.Value.StartTime).TotalSeconds),
                    bitrate = p.Value.Bitrate,
                    cpuUsage = p.Value.ProcessorUsageComputed,
                }
            });
        }

        [HttpGet, Route("GetStreamLogs")]
        public async Task<IEnumerable<string>> GetStreamLogs(string sessionToken, string? Name)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            if (Name == null)
            {
                var activeFfmpegProcessCount = $"Active FFMPEG processes: {_ffmpegRepository.GetActiveFFMPEGProcesses().Length}";
                var mediaLogs = _mediaServerLogs.Logs.Select(l => $"{l.AddedAt}Z: {l.Content}");
                return mediaLogs.Prepend(activeFfmpegProcessCount);
            }
            _processes.All.TryGetValue(Name, out var streamInfo);
            if (streamInfo == null) return [];
            return streamInfo.Logs.Select(l => $"{l.AddedAt}Z: {l.Content}");
        }

        [HttpPost, Route("Probe")]
        public async Task<object?> Probe([FromForm] ProbeDTO probeDTO)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(probeDTO.SessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            return await _ffmpegRepository.Probe(probeDTO.CustomHeaders, probeDTO.URL);
        }

        // Development only 
        // Serves directly from wwwroot in production
        [HttpGet, Route("Streams/{Name}/{File}")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true, Duration = 0)]
        public IActionResult Streams(string Name, string File)
        {
            if (!_ffmpegRepository.IsDevelopment()) throw new Exception();
            var directory = _ffmpegRepository.GetStreamDirectory(Name);
            var contentType = File.EndsWith("m3u8") ? "application/vnd.apple.mpegurl" : "video/mp2t";
            return PhysicalFile($"{directory}/{File.ToLower()}", contentType, true);
        }

        [HttpPost, Route("AuthenticatePublish")]
        public async Task<IActionResult> AuthenticatePublish()
        {
            var data = await HttpContext.Request.ReadFormAsync();
            string? streamName = data["name"];
            string? auth = data["auth"];
            if (streamName == null || auth == null) return UnprocessableEntity();
            var endpoint = await _rtmpEndpointRepository.GetByName(streamName);
            return endpoint!.PublishKey == auth ? Ok() : Unauthorized();
        }
    }
}
