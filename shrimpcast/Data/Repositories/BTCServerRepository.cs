using Newtonsoft.Json;
using shrimpcast.Entities;
using shrimpcast.Entities.DTO;
using System.Text.Json;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class BTCServerRepository(ConfigurationSingleton configurationSingleton) : IBTCServerRepository
    {
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async Task<bool> CheckStatus()
        {
            using var client = new HttpClient() { Timeout = TimeSpan.FromSeconds(15) };
            var request = GetRequest("health");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var parsedResponse = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(parsedResponse);
            var status = document.RootElement.GetProperty("synchronized").GetBoolean();
            return status;
        }

        public async Task<string> GenerateInvoice(string name, int sessionId)
        {
            if (!await CheckStatus()) throw new Exception("BTCServer is unavailable.");
            var configuration = _configurationSingleton.Configuration;
            var identifier = $"{name} [{sessionId}]";
            var description = $"{configuration.GoldenPassTitle} golden pass - {identifier}";
            using var client = new HttpClient() { Timeout = TimeSpan.FromSeconds(15) };
            var request = GetRequest($"stores/{configuration.BTCServerStoreId}/invoices", true);
            var payload = "{\"metadata\": {\"itemDesc\": \"{0}\", \"orderId\": \"{1}\"},\"amount\": \"{2}\"}"
                          .Replace("{0}", description)
                          .Replace("{1}", $"{sessionId}")
                          .Replace("{2}", $"{configuration.GoldenPassValue}");
            var content = new StringContent(payload, null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var invoice = JsonConvert.DeserializeObject<InvoiceDTO>(responseContent);
            return invoice?.CheckoutLink ?? throw new Exception("Could not get checkout link.");
        }

        public async Task<List<InvoiceDTO>?> GetInvoices(int sessionId)
        {
            try
            {
                if (!await CheckStatus()) return null;
                var configuration = _configurationSingleton.Configuration;
                using var client = new HttpClient() { Timeout = TimeSpan.FromSeconds(15) };
                var request = GetRequest($"stores/{configuration.BTCServerStoreId}/invoices?orderId={sessionId}");
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                var invoices = JsonConvert.DeserializeObject<List<InvoiceDTO>>(responseContent);
                return invoices;
            } catch (Exception) { return null; }
        }

        private HttpRequestMessage GetRequest(string path, bool usePost = false)
        {
            var configuration = _configurationSingleton.Configuration;
            var request = new HttpRequestMessage(usePost ? HttpMethod.Post : HttpMethod.Get, $"https://{configuration.BTCServerInstanceURL}/{path}");
            request.Headers.Add("User-Agent", $"shrimpcast/{Constants.BACKEND_VERSION}");
            request.Headers.Add("Authorization", $"token {configuration.BTCServerApiKey}");
            return request;
        }
    }
}
