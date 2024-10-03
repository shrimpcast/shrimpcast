using Hangfire;
using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities;
using System.Net;
using System.Text.Json;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class BTCServerRepository(APPContext context, ConfigurationSingleton configurationSingleton) : IBTCServerRepository
    {
        private readonly APPContext _context = context;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async Task<bool> CheckStatus()
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://{_configurationSingleton.Configuration.BTCServerInstanceURL}/health");
            request.Headers.Add("User-Agent", $"Shrimpcast/{Constants.BACKEND_VERSION}");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var parsedResponse = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(parsedResponse);
            var status = document.RootElement.GetProperty("synchronized").GetBoolean();
            return status;
        }

        public async Task<string> GenerateInvoice()
        {
            if (!await CheckStatus()) throw new Exception("BTCServer is unavailable.");
            return string.Empty;
        }
    }
}
