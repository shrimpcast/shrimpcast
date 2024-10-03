namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IBTCServerRepository
    {
        Task<string> GenerateInvoice();
    }
}
