using shrimpcast.Entities.DTO;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IBTCServerRepository
    {
        Task<string> GenerateInvoice(string name, int sessionId, int amount);

        Task<List<InvoiceDTO>?> GetInvoices(int sessionId);
    }
}
