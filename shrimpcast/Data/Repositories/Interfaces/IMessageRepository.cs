using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        Task<List<Message>> GetExisting();
        Task<Message> GetById(int MessageId);
        Task<string?> ShouldEnforceCooldown(string RemoteAddress);
        Task<Message> Add(bool runCooldownChecks, int SessionId, string RemoteAddress, string? UserAgent, string Content, string MessageType);
        Task<Message> Remove(int MessageId, bool RequestedByMod);
        Task<bool> HasEnoughCountBySessionId(int SessionId, int RequiredCount);
    }
}

