using Hangfire;
using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using System.Net;
using System.Text.Json;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class VpnAddressRepository(APPContext context, ConfigurationSingleton configurationSingleton) : IVpnAddressRepository
    {
        private readonly APPContext _context = context;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async Task<bool> IsVpnAddress(string RemoteAddress)
        {
            var ConnectingIP = IPAddress.Parse(RemoteAddress);
            var EntryExists = await _context.VpnAddresses.AsNoTracking()
                                                         .FirstOrDefaultAsync(ip => IPAddress.Parse(ip.RemoteAddress).Equals(ConnectingIP));

            if (EntryExists == null) BackgroundJob.Enqueue(() => VerifyRemoteAddress(RemoteAddress));
            return EntryExists != null && EntryExists.IsVPN;
        }

        public async Task VerifyRemoteAddress(string RemoteAddress)
        {
            var BlockStatus = await InvokeVerificationService(RemoteAddress);
            if (BlockStatus == -1) return;

            var VPNAddress = new VpnAddress
            {
                RemoteAddress = RemoteAddress,
                IsVPN = BlockStatus == 1
            };

            try
            {
                await _context.AddAsync(VPNAddress);
                await _context.SaveChangesAsync();
            } catch (Exception) {}
        }

        private async Task<int> InvokeVerificationService(string RemoteAddress)
        {
            // If the service is unavailable, return -1 and temporarily allow the IP.
            var blockStatus = -1;
            try
            {
                var client = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
                // For more information regarding the API, visit: https://iphub.info/api
                var apiUrl = "https://v2.api.iphub.info/ip/";
                var request = new HttpRequestMessage(HttpMethod.Get, $"{apiUrl}{RemoteAddress}");
                request.Headers.Add("X-Key", _configurationSingleton.Configuration.IPServiceApiKey);
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(responseContent);
                blockStatus = document.RootElement.GetProperty("block").GetInt32();
            } catch (Exception) {}
            return blockStatus;
        }
    }
}
