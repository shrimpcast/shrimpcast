using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DTO;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;
using System.Text.Json.Nodes;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class MediaServerController(IProcessRepository processRepository, ISessionRepository sessionRepository, Processes<SiteHub> processes) : ControllerBase
    {
        private readonly IProcessRepository _processRepository = processRepository;
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly Processes<SiteHub> _processes = processes;


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
            return _processes.All.Select(p => new {
                name = p.Key,
                rawJsonSettings = new
                {
                    stream = p.Value.Stream,
                    launchCommand = p.Value.LaunchCommand,
                },
                streamUrl = p.Value.StreamPath,
                processStatus = new
                {
                    runningStatus = p.Value.Process.HasExited ? "Connecting" : "Connected",
                    runningTime = TimeSpan.FromSeconds((int)(DateTime.UtcNow - p.Value.Process.StartTime.ToUniversalTime()).TotalSeconds)
                }
            });
        }

        [HttpGet, Route("GetStreamLogs")]
        public async Task<IEnumerable<string>> GetStreamLogs(string sessionToken, string Name)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(sessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            _processes.All.TryGetValue(Name, out var streamInfo);
            if (streamInfo == null) return [];
            return streamInfo.Logs.Select(l => $"[{l.AddedAt}]: {l.Content}");
        }

        [HttpPost, Route("Probe")]
        public async Task<object?> Probe([FromForm] ProbeDTO probeDTO)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(probeDTO.SessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            (string process, string command) = FFMPEGHelper.BuildProbeCommand(probeDTO.CustomHeaders, probeDTO.URL);
            try
            {
                var probe = await _processRepository.ExecSingleInstanceProcess(process, command, ReturnOutput: true);
                return JsonNode.Parse(probe);
            }
            catch (Exception)
            {
                return $"Error: Probe failed ({process} {command})";
            }
        }


        // Development only 
        [HttpGet, Route("Stream/{Name}/{File}")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true, Duration = 0)]
        public IActionResult Stream(string Name, string File)
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development") throw new Exception();
            var dir = FFMPEGHelper.GetStreamDir(Name);
            var contentType = File.EndsWith("m3u8") ? "application/vnd.apple.mpegurl" : "video/mp2t";
            return PhysicalFile($"{dir}/{File.ToLower()}", contentType , true);
        }
    }
}
