using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class SessionController(ISessionRepository sessionRepository, IBanRepository banRepository, IPollRepository pollRepository, INameColourRepository nameColourRepository, ITorExitNodeRepository torExitNodeRepository, IVpnAddressRepository vpnAddressRepository, INotificationRepository notificationRepository, IEmoteRepository emoteRepository, IHubContext<SiteHub> hubContext, ConfigurationSingleton configurationSingleton, Connections<SiteHub> activeConnections) : ControllerBase
    {
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly IBanRepository _banRepository = banRepository;
        private readonly IPollRepository _pollRepository = pollRepository;
        private readonly INameColourRepository _nameColourRepository = nameColourRepository;
        private readonly ITorExitNodeRepository _torExitNodeRepository = torExitNodeRepository;
        private readonly IVpnAddressRepository _vpnAddressRepository = vpnAddressRepository;
        private readonly INotificationRepository _notificationRepository = notificationRepository;
        private readonly IEmoteRepository _emoteRepository = emoteRepository;
        private readonly IHubContext<SiteHub> _hubContext = hubContext;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        private readonly Connections<SiteHub> _activeConnections = activeConnections;


        [HttpGet, Route("GetNewOrExisting")]
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
                    message,
                    configuration = new
                    {
                        configuration.StreamTitle,
                        configuration.PalettePrimary,
                        configuration.PaletteSecondary,
                        configuration.UseDarkTheme,
                    },
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
                ensureCreated.IsGolden,
                ensureCreated.SessionId,
                ensureCreated.SessionNames.Last().Name,
                ensureCreated.SessionToken,
                ensureCreated.UserDisplayColor,
            };
        }

        [HttpPost, Route("ConfirmGoldStatus")]
        public async Task<IActionResult> ConfirmGoldStatus()
        {
            // Verify that the payload comes from an authenticated webhook
            var configuration = _configurationSingleton.Configuration;
            var sessionId = await HMACSHA256Auth.VerifyPayload(Request, configuration.BTCServerWebhookSecret);
            var isGolden = await _sessionRepository.SetGoldStatus(sessionId);

            var connections = _activeConnections.All.Where(ac => ac.Value.Session.SessionId == sessionId);
            var connectionKeys = connections.Select(c => c.Key);

            foreach (var connection in connections)
            {
                connection.Value.Session.IsGolden = isGolden;
            }

            await _hubContext.Clients.Clients(connectionKeys).SendAsync("GoldStatusUpdate", isGolden);
            await _hubContext.Clients.Clients(connectionKeys).SendAsync("ChatMessage", new Message
            {
                Content = $"You are now a golden user. Thank you for buying the {configuration.GoldenPassTitle} golden pass! Remember to save your session token.",
                CreatedAt = DateTime.UtcNow,
                MessageType = "SystemMessage",
                MessageId = new Random().Next(),
                SessionId = 0,
                UserColorDisplay = null,
            });
            await _hubContext.Clients.All.SendAsync("ChatMessage", new Message
            {
                Content = "GoldenAdded",
                CreatedAt = DateTime.UtcNow,
                MessageType = "UserColourChange",
                SessionId = sessionId,
                MessageId = new Random().Next()
            });

            return Ok();
        }
    }
}
