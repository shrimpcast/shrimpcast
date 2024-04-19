using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        Task<List<Message>> GetExisting();
        Task<Message> GetById(int MessageId);
        Task<DateTime?> GetLastSentTime(string RemoteAddress);
        Task<Message> Add(int SessionId, string RemoteAddress, string Content, string MessageType);
        Task<bool> Remove(int MessageId, int DeletedBy);
        Task<bool> HasEnoughCountBySessionId(int SessionId, int Count);
    }
}

