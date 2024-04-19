using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IBanRepository
    {
        Task<Session?> Ban(int sessionId, int bannedBy);
        Task<bool> IsBanned(string RemoteAddress, string accessToken);
        Task<List<Ban>> GetAllBans();
        Task<bool> Unban(int banId);
    }
}

