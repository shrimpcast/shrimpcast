using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Helpers;

namespace shrimpcast.Data.Repositories
{
    public class SessionRepository : ISessionRepository
    {
        private readonly APPContext _context;
        private readonly ConfigurationSingleton _configurationSingleton;
        private readonly INameColourRepository _nameColourRepository;

        public SessionRepository(APPContext context, ConfigurationSingleton configurationSingleton, INameColourRepository nameColourRepository)
        {
            _context = context;
            _configurationSingleton = configurationSingleton;
            _nameColourRepository = nameColourRepository;
        }

        public async Task<Session?> GetExistingAsync(string accessToken, string RemoteAddress)
        {
            var tokenExists = await _context.Sessions.FirstOrDefaultAsync(Session => Session.SessionToken == accessToken);
            if (tokenExists == null) return null;

            var IPExists = await _context.SessionIPs.FirstOrDefaultAsync(SessionIP => SessionIP.SessionId == tokenExists.SessionId && SessionIP.RemoteAddress == RemoteAddress);
            if (IPExists == null)
            {
                var SessionIP = new SessionIP
                {
                    SessionId = tokenExists.SessionId,
                    RemoteAddress = RemoteAddress,
                    CreatedAt = DateTime.UtcNow,
                };
                await _context.AddAsync(SessionIP);
                await _context.SaveChangesAsync();
            }

            tokenExists.SessionNames = await GetAllNames(tokenExists.SessionId);
            return tokenExists;
        }

        public async Task<Session> GetExistingByIdAsync(int sessionId, bool skipNames)
        {
            var account = await _context.Sessions.FirstAsync(Session => Session.SessionId == sessionId);
            if (!skipNames)
            {
                account.SessionNames = await GetAllNames(sessionId);
            }
            return account;
        }

        public async Task<Session> GetExistingByTokenAsync(string accessToken)
        {
            var account = await _context.Sessions.AsNoTracking().FirstAsync(Session => Session.SessionToken == accessToken);
            return account;
        }


        public async Task<Session> GetNewOrExistingAsync(string accessToken, string RemoteAddress)
        {
            var tokenExists = await GetExistingAsync(accessToken, RemoteAddress);
            if (tokenExists != null) return tokenExists;

            var Session = new Session
            {
                CreatedAt = DateTime.UtcNow,
                SessionToken = SecureToken.GenerateTokenThreadSafe(),
                UserDisplayColor = await _nameColourRepository.GetRandom(),
            };

            await _context.AddAsync(Session);
            await _context.SaveChangesAsync();

            var SessionName = new SessionName
            {
                Name = $"{_configurationSingleton.Configuration.DefaultName}-{Guid.NewGuid().ToString()[..5]}",
                SessionId = Session.SessionId,
                CreatedAt = DateTime.UtcNow,
            };

            var SessionIP = new SessionIP
            {
                RemoteAddress = RemoteAddress,
                SessionId = Session.SessionId,
                CreatedAt = DateTime.UtcNow,
            };

            await _context.AddRangeAsync(SessionIP, SessionName);
            await _context.SaveChangesAsync();
            return Session;
        }

        public async Task<SessionName> ChangeName(int sessionId, string NewName)
        {
            var newName = new SessionName
            {

                Name = NewName,
                SessionId = sessionId,
                CreatedAt = DateTime.UtcNow
            };
            await _context.AddAsync(newName);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? newName : throw new Exception("Could not add name.");
        }

        public async Task<List<SessionName>> GetAllNames(int sessionId)
        {
            var SessionNames = _context.SessionNames.AsNoTracking().Where(SessionName => SessionName.SessionId == sessionId)
                                                                   .OrderBy(SessionName => SessionName.CreatedAt);
            return await SessionNames.ToListAsync();
        }

        public async Task<string> GetCurrentName(int sessionId)
        {
            var SessionNames = _context.SessionNames.Where(SessionName => SessionName.SessionId == sessionId);
            var Current = await SessionNames.OrderBy(x => x.CreatedAt).LastAsync();
            return Current.Name;
        }

        public async Task<List<SessionIP>> GetAllIPs(int sessionId)
        {
            var SessionIPs = _context.SessionIPs.AsNoTracking().Where(SessionIP => SessionIP.SessionId == sessionId);
            return await SessionIPs.ToListAsync();
        }

        public async Task<DateTime> Mute(int sessionId)
        {
            var MuteLength = _configurationSingleton.Configuration.MuteLenghtInMinutes;
            var Session = await GetExistingByIdAsync(sessionId, true);
            Session.MutedUntil = DateTime.UtcNow.AddMinutes(MuteLength);
            return await _context.SaveChangesAsync() > 0 ? Session.MutedUntil.Value : throw new Exception("Could not update record.");
        }

        public async Task<string> UpdateColour(int sessionId, int nameColourId)
        {
            var colour = await _nameColourRepository.GetById(nameColourId);
            var session = await GetExistingByIdAsync(sessionId, true);
            session.UserDisplayColor = colour.ColourHex;
            return await _context.SaveChangesAsync() > 0 ? session.UserDisplayColor : throw new Exception("Could not update record");
        }

        public async Task<List<object>> ListActiveMutes()
        {
            var now = DateTime.UtcNow;
            var activeMutes = from session in _context.Sessions
                              where session.MutedUntil > now
                              select new
                              {
                                  session.SessionId,
                                  SessionName = (from sn in _context.SessionNames where sn.SessionId == session.SessionId orderby sn.CreatedAt select sn.Name).Last(),
                              };
            var result = await activeMutes.AsNoTracking().ToListAsync();
            return result.Cast<object>().ToList();
        }

        public async Task<bool> Unmute(int sessionId)
        {
            var Session = await GetExistingByIdAsync(sessionId, true);
            Session.MutedUntil = null;
            return await _context.SaveChangesAsync() > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<bool> ToggleModStatus(int sessionId, bool shouldAdd)
        {
            var Session = await GetExistingByIdAsync(sessionId, true);
            Session.IsMod = shouldAdd;
            return await _context.SaveChangesAsync() > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<List<object>> ListMods()
        {
            var mods = from session in _context.Sessions
                       where session.IsMod == true
                       select new
                       {
                           session.SessionId,
                           SessionName = (from sn in _context.SessionNames where sn.SessionId == session.SessionId orderby sn.CreatedAt select sn.Name).Last(),
                       };

            var result = await mods.AsNoTracking().ToListAsync();
            return result.Cast<object>().ToList();
        }

        public async Task<bool> ToggleVerifiedStatus(int sessionId, bool shouldVerify)
        {
            var Session = await GetExistingByIdAsync(sessionId, true);
            Session.IsVerified = shouldVerify;
            return await _context.SaveChangesAsync() > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<bool> SetGoldStatus(int sessionId)
        {
            var Session = await GetExistingByIdAsync(sessionId, true);
            Session.IsGolden = true;
            await _context.SaveChangesAsync();
            // Get the updated status in case multiple hooks are fired simultaneously 
            return (await GetExistingByIdAsync(sessionId, true)).IsGolden ? true : throw new Exception("Could not update record");
        }
    }
}

