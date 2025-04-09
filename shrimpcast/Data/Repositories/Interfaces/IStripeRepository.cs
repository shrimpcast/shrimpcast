namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IStripeRepository
    {
        Task<string> GenerateInvoice(string name, int sessionId, string successUrl);
    }
}
