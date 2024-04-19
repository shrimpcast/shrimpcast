using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class BanRepository(APPContext context, ISessionRepository sessionRepository) : IBanRepository
    {
        private readonly APPContext _context = context;
        private readonly ISessionRepository _sessionRepository = sessionRepository;

        public async Task<Session?> Ban(int sessionId, int bannedBy)
        {
            var Session = await _sessionRepository.GetExistingByIdAsync(sessionId, false);
            if (Session.IsAdmin) return null;
            Session.SessionIPs = await _sessionRepository.GetAllIPs(sessionId);
            var Ban = new Ban
            {
                SessionId = sessionId,
                BannedBy = bannedBy,
                CreatedAt =  DateTime.UtcNow,
            };

            var existingBan = await _context.Bans.Where(ban => ban.SessionId == sessionId).FirstOrDefaultAsync();
            if (existingBan != null) return Session;

            await _context.AddAsync(Ban);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? Session : throw new Exception("Could not apply ban.");
        }

        public async Task<bool> IsBanned(string RemoteAddress, string accessToken)
        {
            var query = from bans in _context.Bans
                        join sip in _context.SessionIPs on bans.SessionId equals sip.SessionId
                        join s in _context.Sessions on bans.SessionId equals s.SessionId
                        where sip.RemoteAddress == RemoteAddress || s.SessionToken == accessToken
                        select sip.RemoteAddress;
            return await query.AsNoTracking().AnyAsync();
        }

        public async Task<List<Ban>> GetAllBans()
        {
            var query = from ban in _context.Bans
                        orderby ban.CreatedAt
                        select new Ban
                        {
                            BanId = ban.BanId,
                            SessionId = ban.SessionId,
                            SessionName = (from sn in _context.SessionNames where sn.SessionId == ban.SessionId orderby sn.CreatedAt select sn.Name).Last(),
                        };
            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<bool> Unban(int banId)
        {
            var ban = await _context.Bans.FirstAsync(ban => ban.BanId == banId);
            _context.Bans.Remove(ban);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

