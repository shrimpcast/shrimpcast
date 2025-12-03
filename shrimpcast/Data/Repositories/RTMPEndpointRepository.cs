using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class RTMPEndpointRepository(APPContext context) : IRTMPEndpointRepository
    {
        private readonly APPContext _context = context;

        public async Task<RTMPEndpoint?> Add(RTMPEndpoint rtmpEndpoint)
        {
            if (_context.RTMPEndpoints.AsNoTracking().FirstOrDefault(re => re.Name == rtmpEndpoint.Name) != null) return null;
            await _context.AddAsync(rtmpEndpoint);
            var result = await _context.SaveChangesAsync();
            var publicIP = await GetInstanceIp();
            FillEndpoints(rtmpEndpoint, publicIP);
            return result > 0 ? rtmpEndpoint : throw new Exception("Could not add rtmp endpoint.");
        }

        public async Task<List<RTMPEndpoint>> GetAll()
        {
            var endpoints = await _context.RTMPEndpoints.AsNoTracking().ToListAsync();
            var publicIP = await GetInstanceIp();
            endpoints.ForEach(endpoint => FillEndpoints(endpoint, publicIP));
            return endpoints;
        }

        public async Task<RTMPEndpoint?> GetByName(string Name) =>
            await _context.RTMPEndpoints.AsNoTracking().FirstOrDefaultAsync(re => re.Name == Name);

        public async Task<bool> Edit(RTMPEndpoint _rtmpEndpoint)
        {
            var rtmpEndpoint = await _context.RTMPEndpoints.FirstAsync(re => re.RTMPEndpointId == _rtmpEndpoint.RTMPEndpointId);
            _context.Entry(rtmpEndpoint).CurrentValues.SetValues(_rtmpEndpoint);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Remove(int RTMPEndpointId)
        {
            var rtmpEndpoint = await _context.RTMPEndpoints.FirstAsync(re => re.RTMPEndpointId == RTMPEndpointId);
            _context.RTMPEndpoints.Remove(rtmpEndpoint);
            return await _context.SaveChangesAsync() > 0 ? true : throw new Exception("Could not remove item.");
        }

        private async Task<string> GetInstanceIp()
        {
            string? publicIP = "{your_server_ip}";
            try
            {
                using var client = new HttpClient();
                publicIP = await client.GetStringAsync("https://api.ipify.org");
            } catch (Exception) { }
            return publicIP;
        }

        private void FillEndpoints(RTMPEndpoint endpoint, string instanceIp)
        {
            endpoint.IngressUrl = $"rtmp://{instanceIp}:1935/live";
            endpoint.PublishKey = $"{endpoint.Name}?auth={endpoint.PublishKey}";
            endpoint.EgressUrl = $"rtmp://{instanceIp}:1935/live/{endpoint.Name}";
        }
    }
}
