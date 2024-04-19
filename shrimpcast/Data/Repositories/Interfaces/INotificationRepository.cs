using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<bool> Add(int SessionId, string Endpoint, string P256, string Auth);
        Task<bool> Remove(int NotificationId);
        Task<List<Notification>> GetAll();
        Task<bool> ExistsById(int SessionId);
        Task<string> SendAll();
    }
}

