using Stripe;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace shrimpcast.Helpers
{
    public class HMACSHA256Auth
    {
        public static async Task<int> VerifyPayload(HttpRequest request, string? webhookSecret)
        {
            if (string.IsNullOrEmpty(webhookSecret)) throw new Exception("webhookSecret must be supplied");

            using var reader = new StreamReader(request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var receivedSignature = request.Headers["BTCPAY-SIG"].ToString();

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhookSecret));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(requestBody));
            var computedSignature = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

            if (computedSignature != receivedSignature.Replace("sha256=", string.Empty))
            {
                throw new ProtocolViolationException("Permission denied");
            }

            return ParsePayload(requestBody);
        }

        public static async Task<int> VerifyPayloadStripe(HttpRequest request, string? webhookSecret)
        {
            if (string.IsNullOrEmpty(webhookSecret)) throw new Exception("webhookSecret must be supplied");

            using var reader = new StreamReader(request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var stripeSignature = request.Headers["Stripe-Signature"].ToString();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(requestBody, stripeSignature, webhookSecret);
                if (stripeEvent.Type != "checkout.session.completed") throw new Exception("Expected checkout.session.completed");
                if (stripeEvent.Data.Object is not Stripe.Checkout.Session payload || payload.Metadata == null) throw new Exception("Metadata expected.");
                return int.Parse(payload.Metadata["orderId"]);
            }
            catch (Exception ex)
            {
                throw new ProtocolViolationException(ex.Message);
            }
        }

        private static int ParsePayload(string requestBody)
        {
            using var document = JsonDocument.Parse(requestBody);
            var orderId = document.RootElement.GetProperty("metadata").GetProperty("orderId").GetString();
            var validSessionId = int.TryParse(orderId, out int sessionId);
            if (validSessionId) return sessionId;
            else throw new Exception($"Invalid orderId {orderId}");
        }
    }
}
