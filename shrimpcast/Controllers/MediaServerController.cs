using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DTO;
using shrimpcast.Helpers;
using System.Text.Json.Nodes;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class MediaServerController(IMediaServerStreamRepository mediaServerStreamRepository, ISessionRepository sessionRepository) : ControllerBase
    {
        private readonly IMediaServerStreamRepository _mediaServerStreamRepository = mediaServerStreamRepository;
        private readonly ISessionRepository _sessionRepository = sessionRepository;


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

        [HttpPost, Route("Probe")]
        public async Task<object?> Probe([FromForm] ProbeDTO probeDTO)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(probeDTO.SessionToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            return await FFMPEGHelper.FFProbe(probeDTO.CustomHeaders, probeDTO.URL);
        }
    }
}
