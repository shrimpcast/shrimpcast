using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class SessionController(ISessionRepository sessionRepository, IBanRepository banRepository, IPollRepository pollRepository, INameColourRepository nameColourRepository, ITorExitNodeRepository torExitNodeRepository, INotificationRepository notificationRepository, IEmoteRepository emoteRepository, ConfigurationSingleton configurationSingleton) : ControllerBase
    {
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly IBanRepository _banRepository = banRepository;
        private readonly IPollRepository _pollRepository = pollRepository;
        private readonly INameColourRepository _nameColourRepository = nameColourRepository;
        private readonly ITorExitNodeRepository _torExitNodeRepository = torExitNodeRepository;
        private readonly INotificationRepository _notificationRepository = notificationRepository;
        private readonly IEmoteRepository _emoteRepository = emoteRepository;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        [HttpGet, Route("[action]")]
        public async Task<object> GetNewOrExisting([FromQuery] string accessToken)
        {
            var remoteAddress = (HttpContext.Connection.RemoteIpAddress?.ToString()) ?? throw new Exception("RemoteAddress can't be null");
            var ensureCreated = await _sessionRepository.GetNewOrExistingAsync(accessToken, remoteAddress);
            var isAdmin = ensureCreated.IsAdmin;
            var configuration = _configurationSingleton.Configuration;

            var isBanned = await _banRepository.IsBanned(remoteAddress, ensureCreated.SessionToken);
            if (!isAdmin && isBanned) return new { message = Constants.BANNED_MESSAGE };

            var IsTorAndBlocked = configuration.BlockTORConnections && await _torExitNodeRepository.IsTorExitNode(remoteAddress);
            if (!isAdmin && IsTorAndBlocked) return new { message = Constants.TOR_DISABLED_MESSAGE };

            var openAt = configuration.OpenAt;
            if (!isAdmin && openAt > DateTime.UtcNow) return new { message = openAt };

            var emotes = await _emoteRepository.GetAll();
            var poll = await _pollRepository.GetExistingOrNew(false);
            var canAddVote = await _pollRepository.CanAddVote(remoteAddress, ensureCreated.SessionId);
            var colours = await _nameColourRepository.GetAll();
            var subscribed = await _notificationRepository.ExistsById(ensureCreated.SessionId);

            return new
            {
                configuration,
                emotes,
                poll,
                canAddVote?.PollOptionId,
                colours,
                subscribed,
                isAdmin,
                ensureCreated.IsMod,
                ensureCreated.SessionId,
                ensureCreated.SessionNames.Last().Name,
                ensureCreated.SessionToken,
                ensureCreated.UserDisplayColor,
            };
        }
    }
}
