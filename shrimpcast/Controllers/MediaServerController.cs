using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DTO;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class MediaServerController(IFFMPEGRepository ffmpegRepository, IRTMPEndpointRepository rtmpEndpointRepository, ISessionRepository sessionRepository, Processes<SiteHub> processes, MediaServerLogs<SiteHub> mediaServerLogs, LBMetrics<SiteHub> lbMetrics, IHubContext<SiteHub> hubContext, ConfigurationSingleton configurationSingleton) : ControllerBase
    {
        private readonly IFFMPEGRepository _ffmpegRepository = ffmpegRepository;
        private readonly IRTMPEndpointRepository _rtmpEndpointRepository = rtmpEndpointRepository;
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly Processes<SiteHub> _processes = processes;
        private readonly MediaServerLogs<SiteHub> _mediaServerLogs = mediaServerLogs;
        private readonly LBMetrics<SiteHub> _lbMetrics = lbMetrics;
        private readonly IHubContext<SiteHub> _hubContext = hubContext;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        [HttpGet, Route("GetSystemStats")]
        public async Task<object> GetSystemStats(string sessionToken)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");

            return new
            {
                system = new SystemStats().GetStats(),
                instances = _lbMetrics.All.Values.Select(instance => new
                {
                    stats = instance, 
                    isHealthy = (DateTime.UtcNow - instance.ReportTime).TotalSeconds < 9,
                }),
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
                    viewers = p.Value.Viewers.Count,
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

        [HttpGet, Route("Streams/{Name}/{File}")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true, Duration = 0)]
        public IActionResult Streams(string Name, string File)
        {
            var isPlaylist = File.EndsWith("m3u8");
            if (!isPlaylist && !_ffmpegRepository.IsDevelopment()) return UnprocessableEntity();

            if (!_processes.All.TryGetValue(Name, out var streamInfo)) return NotFound();
            streamInfo.Viewers.AddOrUpdate(HttpContext.Connection.RemoteIpAddress!, DateTime.UtcNow, (k, oldValue) => DateTime.UtcNow);

            var directory = _ffmpegRepository.GetStreamDirectory(Name);
            var contentType = isPlaylist ? "application/vnd.apple.mpegurl" : "video/mp2t";
            return PhysicalFile(Path.Combine(directory, File.ToLower()), contentType);
        }

        [HttpPost, Route("AuthenticatePublish")]
        public async Task<IActionResult> AuthenticatePublish()
        {
            var data = await HttpContext.Request.ReadFormAsync();
            string? streamName = data["name"];
            string? auth = data["auth"];
            string? call = data["call"];
            string? url = data["tcurl"];

            if (streamName == null || auth == null || call == null || url == null) return UnprocessableEntity();

            var endpoint = await _rtmpEndpointRepository.GetByName(streamName);
            if (endpoint!.PublishKey != auth) return Unauthorized();

            var isConnected = call == "publish";
            var status =  isConnected ? "CONNECTED" : "DISCONNECTED";
            endpoint.PublishStatus = status;

            await _rtmpEndpointRepository.Edit(endpoint);
            await _hubContext.Clients.All.SendAsync("PublishStatusChange", new
            {
                endpoint.Name,
                status,
            });

            if (!isConnected)
            {
                url = $"{url.Trim()}/{streamName}";
                var targets = _processes.All.Values.Where(p => p.Stream.IngressUri == url).ToList();
                targets.ForEach(async target => await _ffmpegRepository.StopStreamProcess(target.Stream.Name, "publish-done"));
            }

            return Ok();
        }

        [HttpPost, Route("SendInstanceMetrics")]
        public IActionResult SendInstanceMetrics(LBMetric metric)
        {
            var config = _configurationSingleton.Configuration;
            if (config.LbAuthToken != metric.AuthToken) return Unauthorized();

            metric.RemoteAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            _lbMetrics.All.AddOrUpdate($"{metric.RemoteAddress}-{metric.InstanceName}", metric, (k, oldValue) => metric);
            return Ok();
        }

        [HttpGet, Route("RemoveInstanceMetrics")]
        public async Task<bool> RemoveInstanceMetrics(string sessionToken, string key)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            return _lbMetrics.All.TryRemove(key, out _);
        }
    }
}
