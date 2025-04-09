using shrimpcast.Entities;
using Stripe;
using Stripe.Checkout;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class StripeRepository(ConfigurationSingleton configurationSingleton) : IStripeRepository
    {
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async Task<bool> CheckStatus()
        {
            var accountService = new AccountService();
            var account = await accountService.GetSelfAsync(GetRequest());
            return account.ChargesEnabled;
        }

        public async Task<string> GenerateInvoice(string name, int sessionId, string successUrl)
        {
            if (!await CheckStatus()) throw new Exception("Stripe is unavailable.");
            var configuration = _configurationSingleton.Configuration;
            var identifier = $"{name} [{sessionId}]";
            var description = $"{configuration.GoldenPassTitle} golden pass - {identifier}";
            var sessionService = new SessionService();
            var session = await sessionService.CreateAsync(
                new SessionCreateOptions
                {
                    LineItems =
                    [
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                Currency = "usd",
                                UnitAmount = configuration.GoldenPassValue * 100,
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = description
                                }
                            },
                            Quantity = 1
                        } 
                    ],
                    Mode = "payment",
                    SuccessUrl = $"https://{successUrl}",
                    Metadata = new Dictionary<string, string> { { "orderId", sessionId.ToString() } }
                },
                GetRequest()
            );
            return session.Url;
        }

        private RequestOptions GetRequest() =>
             new()
             {
                 ApiKey = _configurationSingleton.Configuration.StripeSecretKey,
             };
    }
}
