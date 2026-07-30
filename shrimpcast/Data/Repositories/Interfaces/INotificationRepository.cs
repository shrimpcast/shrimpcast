using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<bool> Add(int SessionId, string Endpoint, string P256, string Auth);
        Task<List<Notification>> GetAll();
        Task<string> SendAll();
    }
}

