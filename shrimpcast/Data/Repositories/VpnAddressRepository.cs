using Hangfire;
using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;

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
            var BlockStatus = await VerifyAddress(RemoteAddress);
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

        public async Task<string> InvokeVerificationService(string RemoteAddress)
        {
            var client = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var configuration = _configurationSingleton.Configuration;
            var baseURL = configuration.IPServiceApiURL;
            if (baseURL.Contains("{IP}")) baseURL = baseURL.Replace("{IP}", RemoteAddress);
            else baseURL = $"{configuration.IPServiceApiURL}{RemoteAddress}";
            var request = new HttpRequestMessage(HttpMethod.Get, baseURL);
            if (!string.IsNullOrEmpty(configuration.OptionalApiKeyHeader))
            {
                request.Headers.Add(configuration.OptionalApiKeyHeader, configuration.IPServiceApiKey);
            }
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }

        public async Task<int> ResetRecords() =>
            await _context.VpnAddresses.ExecuteDeleteAsync();

        private async Task<int> VerifyAddress(string RemoteAddress)
        {
            try
            {
                var responseContent = await InvokeVerificationService(RemoteAddress);
                var matchCriteria = _configurationSingleton.Configuration.VPNDetectionMatchCriteria;
                var matches = new Regex(@"(?<=\[)[^]]+(?=\])").Matches(matchCriteria);
                
                using var document = JsonDocument.Parse(responseContent);
                foreach (var match in matches)
                {
                    var items = match.ToString()?.Split(":");
                    if (items == null || items.Length != 2) continue;
                    document.RootElement.TryGetProperty(items[0], out var element);
                    if (element.ValueKind == JsonValueKind.Undefined) continue;
                    var value = element.GetRawText().Replace("\"", string.Empty);
                    if (value == items[1]) return 1;
                }

                return 0;
            } catch (Exception) {}
            // If the service is unavailable, return -1 and temporarily allow the IP.
            return -1;
        }

    }
}
