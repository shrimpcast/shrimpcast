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
    public class SessionController(ILogger<SessionController> logger, ISessionRepository sessionRepository, IMessageRepository messageRepository, IBanRepository banRepository, IPollRepository pollRepository, INameColourRepository nameColourRepository, ITorExitNodeRepository torExitNodeRepository, IVpnAddressRepository vpnAddressRepository, INotificationRepository notificationRepository, IEmoteRepository emoteRepository, IHubContext<SiteHub> hubContext, ConfigurationSingleton configurationSingleton, Connections<SiteHub> activeConnections) : ControllerBase
    {
        private readonly ILogger<SessionController> _logger = logger;
        private readonly ISessionRepository _sessionRepository = sessionRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
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
        public async Task<object> GetNewOrExisting([FromQuery] string accessToken, [FromQuery] string? version, [FromQuery] string? turnstileToken)
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
                    else
                    {
                        if (configuration.EnableTurnstileMode 
                            && !configuration.TurnstileManagedMode
                            && !ensureCreated.PassedTurnstile
                            && !ensureCreated.IsVerified
                            && !ensureCreated.IsGolden
                            && !ensureCreated.IsMod)
                        {
                            bool isTokenValid = false;
                            if (!string.IsNullOrEmpty(turnstileToken))
                            {
                                isTokenValid = await _sessionRepository.IsTurnstileTokenValid(turnstileToken, remoteAddress);
                                if (isTokenValid) await _sessionRepository.SetTurnstilePassed(ensureCreated.SessionId);
                            }

                            if (!isTokenValid 
                                && !await _messageRepository.HasEnoughCountBySessionId(ensureCreated.SessionId, (int)configuration.TurnstileSkipThreshold))
                            {
                                message = Constants.TURNSTILE_REQUIRED;
                            }
                        }
                        else if (!ensureCreated.IsVerified)
                        {
                            var IsTorAndBlocked = configuration.SiteBlockTORConnections && await _torExitNodeRepository.IsTorExitNode(remoteAddress);
                            if (IsTorAndBlocked) message = Constants.TOR_DISABLED_MESSAGE;

                            var IsVpnAndBlocked = configuration.SiteBlockVPNConnections && await _vpnAddressRepository.IsVpnAddress(remoteAddress);
                            if (IsVpnAndBlocked) message = Constants.VPN_DISABLED_MESSAGE;
                        }

                        if (configuration.MaxConnectedUsers != 0
                            && _activeConnections.All.Count >= configuration.MaxConnectedUsers
                            && !ensureCreated.IsMod
                            && !ensureCreated.IsGolden)
                        {
                            message = Constants.MAX_USERS_REACHED;
                        }

                        if (configuration.ForceLatestVersion && version != Constants.BACKEND_VERSION)
                        {
                            message = Constants.FRONTEND_OUTDATED;
                        }
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
                        configuration.TurnstilePublicKey,
                        configuration.TurnstileTitle,
                        configuration.EnablePWA
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
                ensureCreated.UserColorDisplay,
            };
        }

        [HttpPost, Route("ConfirmGoldStatus")]
        public async Task<IActionResult> ConfirmGoldStatus()
        {
            // Verify that the payload comes from an authenticated webhook
            var configuration = _configurationSingleton.Configuration;
            var sessionId = await HMACSHA256Auth.VerifyPayload(Request, configuration.BTCServerWebhookSecret);
            var isGolden = await _sessionRepository.SetGoldStatus(sessionId);
            return await NotifyGoldStatus(sessionId, isGolden);
        }

        [HttpPost, Route("ConfirmGoldStatusStripe")]
        public async Task<IActionResult> ConfirmGoldStatusStripe()
        {
            // Verify that the payload comes from an authenticated webhook
            var configuration = _configurationSingleton.Configuration;
            var sessionId = await HMACSHA256Auth.VerifyPayloadStripe(Request, configuration.StripeWebhookSecret);
            var isGolden = await _sessionRepository.SetGoldStatus(sessionId);
            return await NotifyGoldStatus(sessionId, isGolden);
        }

        private async Task<IActionResult> NotifyGoldStatus(int sessionId, bool isGolden)
        {
            var configuration = _configurationSingleton.Configuration;
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

        // Must be behind a managed challenge rule 
        // 403 => challenge needed
        // 200 => clereance ok
        [HttpGet, Route("CloudflareChallengeNeeded")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true, Duration = 0)]
        public bool CloudflareChallengeNeeded() => _configurationSingleton.Configuration.TurnstileManagedMode;

        [HttpGet, Route("ImportToken")]
        public async Task<bool> ImportToken([FromQuery] string accessToken)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(accessToken);
            return session != null;
        }
    }
}
