using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface ISessionRepository
    {
        Task<Session?> GetExistingAsync(string accessToken, string RemoteAddress);
        Task<Session> GetExistingByIdAsync(int sessionId, bool skipNames);
        Task<Session> GetExistingByTokenAsync(string sessionToken);
        Task<Session> GetNewOrExistingAsync(string accessToken, string RemoteAddress);
        Task<SessionName> ChangeName(int sessionId, string NewName);
        Task<List<SessionName>> GetAllNames(int sessionId);
        Task<string> GetCurrentName(int sessionId);
        Task<List<SessionIP>> GetAllIPs(int sessionId);
        Task<DateTime> Mute(int sessionId);
        Task<string> UpdateColour(int sessionId, int nameColourId);
        Task<List<object>> ListActiveMutes();
        Task<bool> Unmute(int sessionId);
        Task<bool> ToggleModStatus(int sessionId, bool shouldAdd);
        Task<List<object>> ListMods();
        Task<bool> ToggleVerifiedStatus(int sessionId, bool shouldVerify);
        Task<bool> SetGoldStatus(int sessionId);
        Task<bool> IsTurnstileTokenValid(string response, string remoteAddress);
        Task<bool> SetTurnstilePassed(int sessionId);
    }
}

