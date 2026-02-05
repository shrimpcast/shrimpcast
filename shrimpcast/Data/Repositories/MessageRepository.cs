using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using System.Data;

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
                         where (from bans in _context.Bans where bans.SessionId == message.SessionId select bans.SessionId).FirstOrDefault() == default
                         join session in _context.Sessions on message.SessionId equals session.SessionId
                         orderby message.CreatedAt descending
                         select new Message
                         {
                             Content = message.Content,
                             SessionId = message.SessionId,
                             CreatedAt = message.CreatedAt,
                             MessageType = message.MessageType,
                             MessageId = message.MessageId,
                             UserColorDisplay = session.UserColorDisplay,
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

        public async Task<string?> ShouldEnforceCooldown(string RemoteAddress)
        {
            var query = _context.Messages.Where(message => message.RemoteAddress == RemoteAddress).OrderByDescending(message => message.CreatedAt);
            var message = await query.FirstOrDefaultAsync();
            var lastSent = message?.CreatedAt;
            var secondsDifference = DateTime.UtcNow.Subtract(lastSent.GetValueOrDefault()).TotalSeconds;
            var requiredTime = _configurationSingleton.Configuration.MessageDelayTime;

            if (secondsDifference < requiredTime)
            {
                var diff = Math.Ceiling(requiredTime - secondsDifference);
                return $"You need to wait {diff} more {(diff == 1 ? "second" : "seconds")}.";
            }
            
            return null;
        }

        public async Task<Message> Add(bool runCooldownChecks, int SessionId, string RemoteAddress, string Content, string MessageType)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
            try
            {
                if (runCooldownChecks)
                {
                    var shouldEnforceCooldown = await ShouldEnforceCooldown(RemoteAddress);
                    if (shouldEnforceCooldown != null)
                    {
                        throw new Exception(shouldEnforceCooldown);
                    }
                }

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
                _context.Entry(Message).State = EntityState.Detached;
                await transaction.CommitAsync();

                return result > 0 ? Message : throw new Exception("Could not add message.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> Remove(int MessageId, int DeletedBy)
        {
            var existingMessage = await _context.Messages.FirstAsync(message => message.MessageId == MessageId);
            _context.Messages.Remove(existingMessage);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<bool> HasEnoughCountBySessionId(int SessionId, int RequiredCount)
        {
            var ActualCount = await _context.Messages
                                            .AsNoTracking()
                                            .Where(m => m.SessionId == SessionId)
                                            .Take(RequiredCount)
                                            .CountAsync();
            return ActualCount == RequiredCount;
        }

        public bool IsInEnglish(string Content)
        {
            var detector = _configurationSingleton.LanguageDetector;
            var detectedLang = detector.Predict(Content.ToLower(), 1).FirstOrDefault();
            if (detectedLang == null) return true;
            var isEnglishDetected = detectedLang.Label == "__label__en";
            return isEnglishDetected || detectedLang.Probability < 0.55;
        }
    }
}

