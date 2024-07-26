using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class SessionController(ISessionRepository sessionRepository, IBanRepository banRepository, IPollRepository pollRepository, INameColourRepository nameColourRepository, ITorExitNodeRepository torExitNodeRepository, IVpnAddressRepository vpnAddressRepository, INotificationRepository notificationRepository, IEmoteRepository emoteRepository, ConfigurationSingleton configurationSingleton) : ControllerBase
    {
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly IBanRepository _banRepository = banRepository;
        private readonly IPollRepository _pollRepository = pollRepository;
        private readonly INameColourRepository _nameColourRepository = nameColourRepository;
        private readonly ITorExitNodeRepository _torExitNodeRepository = torExitNodeRepository;
        private readonly IVpnAddressRepository _vpnAddressRepository = vpnAddressRepository;
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

            if (!isAdmin)
            {
                var isBanned = await _banRepository.IsBanned(remoteAddress, ensureCreated.SessionToken);
                object? message = null;

                if (isBanned) message = Constants.BANNED_MESSAGE;
                else 
                {
                    if (configuration.OpenAt > DateTime.UtcNow)
                    {
                        message = configuration.OpenAt;
                    }
                    else if (!ensureCreated.IsVerified)
                    {
                        var IsTorAndBlocked = configuration.SiteBlockTORConnections && await _torExitNodeRepository.IsTorExitNode(remoteAddress);
                        if (IsTorAndBlocked) message = Constants.TOR_DISABLED_MESSAGE;

                        var IsVpnAndBlocked = configuration.SiteBlockVPNConnections && await _vpnAddressRepository.IsVpnAddress(remoteAddress);
                        if (IsVpnAndBlocked) message = Constants.VPN_DISABLED_MESSAGE;
                    }
                }

                if (message != null) return new
                {
                    version = Constants.BACKEND_VERSION,
                    configuration = new { configuration.StreamTitle },
                    message,
                };
            }

            var emotes = await _emoteRepository.GetAll();
            var poll = await _pollRepository.GetExistingOrNew(false);
            var canAddVote = await _pollRepository.CanAddVote(remoteAddress, ensureCreated.SessionId);
            var colours = await _nameColourRepository.GetAll();
            var subscribed = await _notificationRepository.ExistsById(ensureCreated.SessionId);

            return new
            {
                version = Constants.BACKEND_VERSION,
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
