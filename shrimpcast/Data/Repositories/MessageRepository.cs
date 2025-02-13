using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly APPContext _context;
        private readonly ConfigurationSingleton _configurationSingleton;

        public MessageRepository(APPContext context, ConfigurationSingleton configurationSingleton)
        {
            _context = context;
            _configurationSingleton = configurationSingleton;
        }

        public async Task<List<Message>> GetExisting()
        {
            var maxTime = _configurationSingleton.Configuration.OffsetDateTimeInMinutes;
            int MaxMessages = _configurationSingleton.Configuration.MaxMessagesToShow;
            var query = (from message in _context.Messages
                         where !message.IsDeleted && (from bans in _context.Bans where bans.SessionId == message.SessionId select bans.SessionId).FirstOrDefault() == default
                         join session in _context.Sessions on message.SessionId equals session.SessionId
                         orderby message.CreatedAt descending
                         select new Message
                         {
                             Content = message.Content,
                             SessionId = message.SessionId,
                             CreatedAt = message.CreatedAt,
                             MessageType = message.MessageType,
                             MessageId = message.MessageId,
                             UserColorDisplay = session.UserDisplayColor,
                             IsAdmin = session.IsAdmin,
                             IsMod = session.IsMod,
                             IsGolden = session.IsGolden,
                             SentBy = (from name in _context.SessionNames where name.SessionId == message.SessionId orderby name.CreatedAt select name.Name).Last(),
                         }).Take(MaxMessages);
            var result = await query.AsNoTracking().ToListAsync();
            var now = DateTime.UtcNow;
            return result.Where(r => now.Subtract(r.CreatedAt).TotalMinutes < maxTime).ToList();
        }

        public async Task<Message> GetById(int MessageId)
        {
            var message = await _context.Messages.Where(message => message.MessageId == MessageId)
                                                 .AsNoTracking() 
                                                 .FirstAsync();
            return message;
        }

        public async Task<DateTime?> GetLastSentTime(string RemoteAddress)
        {
            var query = _context.Messages.Where(message => message.RemoteAddress == RemoteAddress).OrderByDescending(message => message.CreatedAt);
            var message = await query.FirstOrDefaultAsync();
            return message?.CreatedAt;
        }

        public async Task<Message> Add(int SessionId, string RemoteAddress, string Content, string MessageType)
        {
            var Message = new Message
            {
                SessionId = SessionId,
                CreatedAt = DateTime.UtcNow,
                Content = Content,
                RemoteAddress = RemoteAddress,
                MessageType = MessageType,
            };
            await _context.AddAsync(Message);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? Message : throw new Exception("Could not add message.");
        }

        public async Task<bool> Remove(int MessageId, int DeletedBy)
        {
            var existingMessage = await _context.Messages.FirstAsync(message => message.MessageId == MessageId);
            _context.Messages.Remove(existingMessage);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<bool> HasEnoughCountBySessionId(int SessionId, int Count)
        {
            var query = _context.Messages.AsNoTracking()
                                         .Where(m => m.SessionId == SessionId && !m.IsDeleted)
                                         .Take(Count);
            var existing = await query.ToListAsync();
            return existing.Count == Count;
        }
    }
}

