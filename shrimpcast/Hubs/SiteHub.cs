using Hangfire;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using shrimpcast.Entities.DTO;
using shrimpcast.Helpers;
using shrimpcast.Hubs.Dictionaries;
using System.Collections.Concurrent;
using System.Text;
using System.Text.RegularExpressions;
using Message = shrimpcast.Entities.DB.Message;

namespace shrimpcast.Hubs
{
    public partial class SiteHub : Hub
    {
        private readonly IConfigurationRepository _configurationRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IBanRepository _banRepository;
        private readonly IPollRepository _pollRepository;
        private readonly ITorExitNodeRepository _torExitNodeRepository;
        private readonly IVpnAddressRepository _vpnAddressRepository;
        private readonly IOBSCommandsRepository _obsCommandsRepository;
        private readonly IAutoModFilterRepository _autoModFilterRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IEmoteRepository _emoteRepository;
        private readonly IBingoRepository _bingoRepository;
        private readonly IBTCServerRepository _btcServerRepository;
        private readonly IStripeRepository _stripeRepository;
        private readonly ISourceRepository _sourceRepository;
        private readonly IMediaServerStreamRepository _mediaServerStreamRepository;
        private readonly IProcessRepository _processRepository;
        private readonly IHubContext<SiteHub> _hubContext;
        private readonly ConfigurationSingleton _configurationSigleton;
        private readonly Connections<SiteHub> _activeConnections;
        private readonly Pings<SiteHub> _pings;
        private readonly BingoSuggestions<SiteHub> _bingoSuggestions;
        private readonly Processes<SiteHub> _processes;

        public SiteHub(IConfigurationRepository configurationRepository, ISessionRepository sessionRepository, IMessageRepository messageRepository, IBanRepository banRepository, IPollRepository pollRepository, ITorExitNodeRepository torExitNodeRepository, IHubContext<SiteHub> hubContext, ConfigurationSingleton configurationSingleton, Connections<SiteHub> activeConnections, Pings<SiteHub> pings, IOBSCommandsRepository obsCommandsRepository, IAutoModFilterRepository autoModFilterRepository, INotificationRepository notificationRepository, IEmoteRepository emoteRepository, IBingoRepository bingoRepository, IVpnAddressRepository vpnAddressRepository, BingoSuggestions<SiteHub> bingoSuggestions, IBTCServerRepository btcServerRepository, ISourceRepository sourceRepository, IStripeRepository stripeRepository, IMediaServerStreamRepository mediaServerStreamRepository, Processes<SiteHub> proccesses, IProcessRepository processRepository)
        {
            _configurationRepository = configurationRepository;
            _sessionRepository = sessionRepository;
            _messageRepository = messageRepository;
            _banRepository = banRepository;
            _pollRepository = pollRepository;
            _torExitNodeRepository = torExitNodeRepository;
            _hubContext = hubContext;
            _configurationSigleton = configurationSingleton;
            _activeConnections = activeConnections;
            _pings = pings;
            _obsCommandsRepository = obsCommandsRepository;
            _autoModFilterRepository = autoModFilterRepository;
            _notificationRepository = notificationRepository;
            _emoteRepository = emoteRepository;
            _bingoRepository = bingoRepository;
            _vpnAddressRepository = vpnAddressRepository;
            _bingoSuggestions = bingoSuggestions;
            _btcServerRepository = btcServerRepository;
            _sourceRepository = sourceRepository;
            _stripeRepository = stripeRepository;
            _mediaServerStreamRepository = mediaServerStreamRepository;
            _processes = proccesses;
            _processRepository = processRepository;
        }

        private Configuration Configuration => _configurationSigleton.Configuration;
        private ConcurrentDictionary<string, SignalRConnection> ActiveConnections => _activeConnections.All;
        private SignalRConnection GetCurrentConnection() => ActiveConnections.First(ac => ac.Key == Context.ConnectionId).Value;
        private IEnumerable<string> GetAdminSessions() => ActiveConnections.Where(ac => ac.Value.Session.IsAdmin).Select(ac => ac.Key);

        #region Connection
        public override async Task OnConnectedAsync()
        {
            var RemoteAddress = (Context.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress?.ToString()) ?? throw new Exception("IP can't be null.");
            var accessToken = (Context.GetHttpContext()?.Request.Query["accessToken"].ToString()) ?? throw new Exception("AccessToken can't be null.");
            var Session = await _sessionRepository.GetExistingAsync(accessToken, RemoteAddress);
            var isClosed = !(Session?.IsAdmin).GetValueOrDefault() && Configuration.OpenAt > DateTime.UtcNow;
            
            var reachedMaxUsers = Configuration.MaxConnectedUsers != 0 && ActiveConnections.Count >= Configuration.MaxConnectedUsers
                                  && !(Session?.IsAdmin).GetValueOrDefault() && !(Session?.IsMod).GetValueOrDefault() && !(Session?.IsGolden).GetValueOrDefault();

            var reachedMaxConnectionsPerAddress = !(Session?.IsAdmin).GetValueOrDefault() &&
                ActiveConnections.Where(ac => ac.Value.RemoteAdress == RemoteAddress || ac.Value.Session.SessionToken == accessToken).Count()
                >= Configuration.MaxConnectionsPerIP;

            var mustPassTurnstail = await NeedsPassTurnstail(Session);

            if (Session == null || isClosed || reachedMaxUsers || reachedMaxConnectionsPerAddress || mustPassTurnstail)
            {
                if (isClosed) await ForceDisconnect([Context.ConnectionId], Configuration.OpenAt);
                if (reachedMaxUsers) await ForceDisconnect([Context.ConnectionId], Constants.MAX_USERS_REACHED);
                if (reachedMaxConnectionsPerAddress) await ForceDisconnect([Context.ConnectionId], Constants.MAX_IP_USER_REACHED);
                if (mustPassTurnstail) await ForceDisconnect([Context.ConnectionId], Constants.TURNSTILE_REQUIRED);
                Context.Abort();
                return;
            }

            ActiveConnections.TryAdd(Context.ConnectionId, new SignalRConnection()
            {
                RemoteAdress = RemoteAddress,
                Session = Session,
                ConnectedAt = DateTime.UtcNow,
            });

            await AbortIfBanned();
            await TriggerUserCountChange(false, Session, null);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            try
            {
                var SessionId = GetCurrentConnection().Session.SessionId;
                ActiveConnections.TryRemove(Context.ConnectionId, out _);
                await TriggerUserCountChange(false, null, SessionId);
                await TriggerSourceViewerCountChange(false);
                await base.OnDisconnectedAsync(exception);
            } catch (Exception) { } // Session already disconnected
        }

        public async Task GetUserCount() => await TriggerUserCountChange(true, null, null);

        public async Task GetSourceViewerCount() => await TriggerSourceViewerCountChange(true);

        public async void SetQueryParams([FromBody] string? source)
        {
            var Connection = GetCurrentConnection();
            if (Connection.QueryParams == source) return;
            Connection.QueryParams = source;
            await TriggerSourceViewerCountChange(false);
        }
        #endregion

        #region Chat
        public async Task<string?> ChangeName([FromBody] string newName)
        {
            var CurrentConnection = GetCurrentConnection();
            var Session = CurrentConnection.Session;
            var RemoteAddress = CurrentConnection.RemoteAdress;

            newName = NormalizeString(newName);
            var notAllowedMessage = await IsChatActionAllowed(newName);
            if (notAllowedMessage != null)
            {
                await DispatchSystemMessage(notAllowedMessage);
                return null;
            }

            var currentName = await _sessionRepository.GetCurrentName(Session.SessionId);
            var isEmpty = string.IsNullOrEmpty(newName.Trim());
            if (newName.Trim() == currentName || isEmpty)
            {
                await DispatchSystemMessage(isEmpty ? "Your name can not be empty." : "You are already using that name.");
                return null;
            }

            var addedName = await _sessionRepository.ChangeName(Session.SessionId, newName);
            foreach (var connection in ActiveConnections.Where(ac => ac.Value.Session.SessionToken == Session.SessionToken))
            {
                connection.Value.Session.SessionNames.Add(addedName);
            }

            string Content = $"{currentName} changed his name to {newName}.",
                   MessageType = "NameChange";

            var addedMessage = await _messageRepository.Add(!Session.IsAdmin && !Session.IsGolden, Session.SessionId, RemoteAddress, Content, MessageType);
            addedMessage.SentBy = newName;
            addedMessage.RemoteAddress = string.Empty;
            addedMessage.UserColorDisplay = string.Empty;
            await NotifyNewMessage(addedMessage);

            var nameChangePayload = new
            {
                addedMessage.SessionId,
                newName,
            };
            if (Configuration.ShowConnectedUsers) await Clients.All.SendAsync("NameChange", nameChangePayload);
            else await Clients.Clients(GetAdminSessions()).SendAsync("NameChange", nameChangePayload);

            var shouldBan = await _autoModFilterRepository.Contains(newName);
            if (shouldBan) BackgroundJob.Enqueue(() => PerformBackgroundBan(addedMessage.SentBy, addedMessage.SessionId, Constants.FIREANDFORGET_TOKEN));
            return newName;
        }

        public async Task<int> NewMessage([FromBody] string message)
        {
            var CurrentConnection = GetCurrentConnection();
            var RemoteAddress = CurrentConnection.RemoteAdress;

            message = NormalizeString(message);
            var notAllowedMessage = await IsChatActionAllowed(message);
            if (notAllowedMessage != null)
            {
                await DispatchSystemMessage(notAllowedMessage);
                return -1;
            }

            message = message.Trim();
            if (string.IsNullOrEmpty(message))
            {
                await DispatchSystemMessage("Your message can not be empty.");
                return 0;
            }

            if (await DispatchCommand(message, CurrentConnection)) return 1;

            var session = CurrentConnection.Session;
            var addedMessage = await _messageRepository.Add(!session.IsAdmin && !session.IsGolden, session.SessionId, RemoteAddress, message, "UserMessage");
            addedMessage.SentBy = session.SessionNames.Last().Name;
            addedMessage.IsAdmin = session.IsAdmin;
            addedMessage.IsMod = session.IsMod;
            addedMessage.IsGolden = session.IsGolden;
            addedMessage.RemoteAddress = string.Empty;
            addedMessage.UserColorDisplay = session.UserColorDisplay;
            await NotifyNewMessage(addedMessage);

            var shouldBan = await _autoModFilterRepository.Contains(addedMessage.Content);
            if (shouldBan) BackgroundJob.Enqueue(() => PerformBackgroundBan(addedMessage.SentBy, addedMessage.SessionId, Constants.FIREANDFORGET_TOKEN));
            return 1;
        }

        public async Task<object> GetInformation([FromBody] int MessageId, [FromBody] int SessionId)
        {
            await AbortIfBanned();
            var messageInfo = MessageId != 0 ? await _messageRepository.GetById(MessageId) : null;
            var userInfo = await _sessionRepository.GetExistingByIdAsync(messageInfo != null ? messageInfo.SessionId : SessionId, false);
            var session = GetCurrentConnection().Session;
            var basicResponse = new
            {
                PreviousNames = userInfo.SessionNames.Select(sn => sn.Name),
                userInfo.CreatedAt,
                userInfo.IsAdmin,
                userInfo.IsMod,
            };

            if (!session.IsAdmin) return new { basicResponse };

            var IPs = await _sessionRepository.GetAllIPs(userInfo.SessionId);
            List<string>? activeSessions = [];

            if (messageInfo != null)
            {
                activeSessions = ActiveConnections.Where(ac => ac.Value.RemoteAdress == messageInfo.RemoteAddress)
                                                  .DistinctBy(ac => ac.Value.Session.SessionToken)
                                                  .Select(ac => ac.Value.Session.SessionNames.Last().Name)
                                                  .ToList();
            }
            else
            {
                activeSessions = ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId)
                                                  .Select(ac => $"{ac.Key}:{ac.Value.RemoteAdress}")
                                                  .ToList();
            }

            return new
            {
                basicResponse,
                IP = messageInfo?.RemoteAddress,
                IPs = IPs.Select(ip => ip.RemoteAddress),
                activeSessions,
                userInfo.MutedUntil,
                userInfo.IsMod,
                userInfo.IsVerified,
            };
        }

        public async Task<string?> ChangeColour([FromBody] int NameColourId)
        {
            var notAllowedMessage = await IsChatActionAllowed(string.Empty);
            if (notAllowedMessage != null)
            {
                await DispatchSystemMessage(notAllowedMessage);
                return null;
            }
            var SessionId = GetCurrentConnection().Session.SessionId;
            var result = await _sessionRepository.UpdateColour(SessionId, NameColourId);
            foreach (var connection in ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId))
            {
                connection.Value.Session.UserColorDisplay = result;
            }

            await NotifyNewMessage(new Message
            {
                Content = result,
                CreatedAt = DateTime.UtcNow,
                MessageType = "UserColourChange",
                SessionId = SessionId,
                MessageId = new Random().Next()
            });
            return result;
        }

        public async Task<bool> RemoveMessage([FromBody] int MessageId)
        {
            await ShouldGrantAccess();
            var result = await _messageRepository.Remove(MessageId, GetCurrentConnection().Session.SessionId);
            await NotifyNewMessage(new Message
            {
                Content = string.Empty,
                CreatedAt = DateTime.UtcNow,
                MessageType = "MessageRemoved",
                MessageId = MessageId,
                SessionId = 0,
            });
            return result;
        }
        #endregion

        #region Bans
        public async Task<bool> Ban([FromBody] int SessionId, [FromBody] bool IsSilent, [FromBody] bool SilentDelete)
        {
            await ShouldGrantAccess();
            return await PerformBan(SessionId, IsSilent, SilentDelete, GetCurrentConnection().Session.SessionId);
        }

        public async Task PerformBackgroundBan(string sentBy, int SessionId, string VerificationToken)
        {
            if (VerificationToken != Constants.FIREANDFORGET_TOKEN) return;
            await Task.Delay(new Random().Next(Configuration.MinABTimeInMs, Configuration.MaxABTimeInMs));
            await PerformBan(SessionId, true, true, -1);
            await DispatchSystemMessage($"[{sentBy}] has been banned by the auto-mod", true, false, GetAdminSessions());
        }

        public async Task<object> ListBans()
        {
            await ShouldGrantAccess();
            var bans = await _banRepository.GetAllBans();
            return new
            {
                totalBans = bans.Count,
                bans,
            };
        }

        public async Task<bool> Unban([FromBody] int banId)
        {
            await ShouldGrantAccess();
            return await _banRepository.Unban(banId);
        }
        #endregion

        #region Mutes
        public async Task<bool> Mute([FromBody] int SessionId)
        {
            await ShouldGrantAccess(true);
            var session = GetCurrentConnection().Session;
            var mutedUntil = await _sessionRepository.Mute(SessionId);

            foreach (var connection in ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId))
            {
                connection.Value.Session.MutedUntil = mutedUntil;
            }

            if (session.IsMod)
            {
                var name = await _sessionRepository.GetCurrentName(SessionId);
                var message = $"{session.SessionNames.Last().Name} muted {name}";
                await DispatchSystemMessage(message, true, false, GetAdminSessions());
            }
            return true;
        }

        public async Task<List<object>> ListActiveMutes()
        {
            await ShouldGrantAccess();
            return await _sessionRepository.ListActiveMutes();
        }

        public async Task<bool> Unmute([FromBody] int SessionId)
        {
            await ShouldGrantAccess();
            var isUnmuted = await _sessionRepository.Unmute(SessionId);
            foreach (var connection in ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId))
            {
                connection.Value.Session.MutedUntil = null;
            }
            return isUnmuted;
        }
        #endregion

        #region Moderators
        public async Task<bool> ToggleModStatus([FromBody] int SessionId, [FromBody] bool ShouldAdd)
        {
            await ShouldGrantAccess();
            var status = await _sessionRepository.ToggleModStatus(SessionId, ShouldAdd);
            var connections = ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId);
            foreach (var connection in connections) connection.Value.Session.IsMod = ShouldAdd;
            await Clients.Clients(connections.Select(c => c.Key)).SendAsync("ModStatusUpdate", ShouldAdd);
            if (ShouldAdd) await DispatchSystemMessage("You are now a janny", true, false, connections.Select(c => c.Key));
            await Task.Delay(100);
            await NotifyNewMessage(new Message
            {
                Content = ShouldAdd ? "ModAdded" : "ModRemoved",
                CreatedAt = DateTime.UtcNow,
                MessageType = "UserColourChange",
                SessionId = SessionId,
                MessageId = new Random().Next()
            });
            return status;
        }

        public async Task<List<object>> ListMods()
        {
            await ShouldGrantAccess();
            return await _sessionRepository.ListMods();
        }

        public async Task<bool> ToggleVerifiedStatus([FromBody] int SessionId, [FromBody] bool ShouldVerify)
        {
            await ShouldGrantAccess();
            var status = await _sessionRepository.ToggleVerifiedStatus(SessionId, ShouldVerify);
            var connections = ActiveConnections.Where(ac => ac.Value.Session.SessionId == SessionId);
            foreach (var connection in connections) connection.Value.Session.IsVerified = ShouldVerify;
            return status;
        }
        #endregion

        #region AutoMod
        public async Task<bool> AddAutoModFilter([FromBody] int SessionId, [FromBody] int MessageId)
        {
            await ShouldGrantAccess();
            var Message = await _messageRepository.GetById(MessageId);
            await _autoModFilterRepository.Add(Message.Content, false, false);
            return await PerformBan(SessionId, true, true, GetCurrentConnection().Session.SessionId);
        }

        public async Task<AutoModFilter?> AddAutoModFilterWithText([FromBody] string Content, [FromBody] bool IgnoreCase, [FromBody] bool IgnoreDiacritic)
        {
            await ShouldGrantAccess();
            Content = Content.Trim();
            if (string.IsNullOrEmpty(Content) || Content.Length < 5)
            {
                await DispatchSystemMessage("Content length must be at least 5.");
                return null;
            }
            return await _autoModFilterRepository.Add(Content, IgnoreCase, IgnoreDiacritic);
        }

        public async Task<bool> RemoveAutoModFilter([FromBody] int AutoModFilterId)
        {
            await ShouldGrantAccess();
            return await _autoModFilterRepository.Remove(AutoModFilterId);
        }

        public async Task<bool> EditAutoModFilter([FromBody] AutoModFilter filter)
        {
            await ShouldGrantAccess();
            return await _autoModFilterRepository.Edit(filter);
        }

        public async Task<List<AutoModFilter>> GetAllAutoModFilters()
        {
            await ShouldGrantAccess();
            return await _autoModFilterRepository.GetAll();
        }
        #endregion

        #region Poll
        public async Task<int> AddPollOption([FromBody] string option)
        {
            var Connection = GetCurrentConnection();
            var Session = Connection.Session;
            if (await CanUsePoll() is var notAllowedMessage && notAllowedMessage != null)
            {
                await DispatchSystemMessage(notAllowedMessage);
                return 0;
            }

            var existingVote = Session.IsAdmin ? null : await _pollRepository.CanAddVote(Connection.RemoteAdress, Session.SessionId);
            if (existingVote != null)
            {
                await DispatchSystemMessage("You already voted on this poll.");
                return 0;
            }

            if (!Session.IsAdmin && !Configuration.AcceptNewOptions)
            {
                await DispatchSystemMessage("Currently not accepting new options.");
                return 0;
            }

            option = NormalizeString(option);
            if (string.IsNullOrEmpty(option))
            {
                await DispatchSystemMessage("Suggestion can not be empty.");
                return 0;
            }

            var pollOption = await _pollRepository.AddOption(Session.SessionId, option);
            await Clients.All.SendAsync("OptionAdded", pollOption);
            int result = 0;
            if (!Connection.Session.IsAdmin)
            {
                await Task.Delay(15);
                result = await VoteOption(pollOption.PollOptionId);
            }
            return result;
        }

        public async Task<bool> RemovePollOption([FromBody] int pollOptionId)
        {
            await ShouldGrantAccess();
            var result = await _pollRepository.RemovePollOption(pollOptionId, pollOptionId == 0);
            await Clients.All.SendAsync("OptionRemoved", pollOptionId);
            await DispatchUpdatedVoteCount();
            return result;
        }

        public async Task<int> VoteOption([FromBody] int pollOptionId)
        {
            var Connection = GetCurrentConnection();
            var Session = Connection.Session;
            if (await CanUsePoll() is var notAllowedMessage && notAllowedMessage != null)
            {
                await DispatchSystemMessage(notAllowedMessage);
                return 0;
            }

            if (!Session.IsAdmin && !Configuration.AcceptNewVotes)
            {
                await DispatchSystemMessage("Currently not accepting new votes.");
                return 0;
            }

            if (!await _pollRepository.IsOptionEnabled(pollOptionId))
            {
                await DispatchSystemMessage("Option does not exist.");
                return 0;
            }

            var existingVote = await _pollRepository.CanAddVote(Connection.RemoteAdress, Session.SessionId);
            int? existingPollOptionId = existingVote?.PollOptionId;
            bool result;
            if (existingVote != null)
            {
                result = await _pollRepository.UpdateVote(existingVote.PollVoteId, pollOptionId, Session.SessionId, Connection.RemoteAdress);
            }
            else
            {
                result = await _pollRepository.AddVote(pollOptionId, Session.SessionId, Connection.RemoteAdress);
            }

            await DispatchUpdatedVoteCount();
            return result ? existingPollOptionId == pollOptionId ? -1 : pollOptionId : 0;
        }

        public async Task<object> GetPollVotes([FromBody] int pollOptionId)
        {
            var Connection = GetCurrentConnection();
            var Session = Connection.Session;

            if (!Session.IsAdmin && !Configuration.ShowVotes)
            {
                await DispatchSystemMessage("Permission denied.");
                throw new Exception("Access denied.");
            }

            var votes = await _pollRepository.GetOptionVotes(pollOptionId);
            var activeConnectionsCount = votes.Where(v => ActiveConnections.Any(ac => ac.Value.Session.SessionId == v.SessionId
                                                                                   || ac.Value.RemoteAdress == v.RemoteAddress));
            return new
            {
                activeUsers = activeConnectionsCount.Count(),
                votes = votes.Select(vote => new
                {
                    vote.SessionId,
                    vote.SessionName,
                    connected = activeConnectionsCount.Any(v => v.SessionId == vote.SessionId),
                })
            };
        }
        #endregion

        #region Bingo
        public async Task<List<BingoOption>> GetAll() => await _bingoRepository.GetAllOptions();

        public async Task<BingoOption?> AddBingoOption([FromBody] string Content)
        {
            await ShouldGrantAccess();
            Content = Content.Trim();
            if (string.IsNullOrEmpty(Content))
            {
                await DispatchSystemMessage("Option content can not be empty.");
                return null;
            }

            var newOption = await _bingoRepository.AddOption(Content);
            await Clients.All.SendAsync("BingoOptionAdded", newOption);
            return newOption;
        }

        public async Task<bool> RemoveBingoOption([FromBody] int BingoOptionId)
        {
            await ShouldGrantAccess();
            await _bingoRepository.RemoveOption(BingoOptionId);
            await Clients.All.SendAsync("BingoOptionRemoved", BingoOptionId);
            return true;
        }

        public async Task<bool> ToggleBingoOptionStatus([FromBody] int BingoOptionId)
        {
            if (!Configuration.ShowBingo)
            {
                await DispatchSystemMessage("Bingo is currently disabled.");
                return false;
            }

            var existingOption = await _bingoRepository.ExistsById(BingoOptionId);
            if (existingOption == null)
            {
                await DispatchSystemMessage("This option has been removed.");
                return false;
            }

            var Connection = GetCurrentConnection();
            var Session = Connection.Session;
            if (!Session.IsMod && !Session.IsAdmin)
            {
                var bingoOptionVotesCount = GetBingoOptionVoteCount(existingOption.BingoOptionId);
                var autoMarkingThreshold = Configuration.AutoMarkingUserCountThreshold;
                var shouldPreAddVote = CanVote(Connection.RemoteAdress, existingOption.BingoOptionId) ? 1 : 0;
                var remainingVotes = Configuration.EnableAutoBingoMarking && autoMarkingThreshold > 1
                                     ? $" ({bingoOptionVotesCount + shouldPreAddVote}/{autoMarkingThreshold})" 
                                     : string.Empty; 
                
                if (existingOption.IsChecked ||
                   await NewMessage($"[BINGO]: I suggest marking [{existingOption.Content}]{remainingVotes}.") == -1) return true;
                var ShouldTriggerAutoMarking = ShouldTriggerBingoAutoMarking(Connection.RemoteAdress, existingOption.BingoOptionId);
                if (!ShouldTriggerAutoMarking) return true;
            }

            var isChecked = await _bingoRepository.ToggleOptionStatus(BingoOptionId);
            await Clients.All.SendAsync("BingoOptionStatusUpdate", new
            {
                BingoOptionId,
                isChecked,
            });
            if (isChecked) await DispatchSystemMessage($"[BINGO]: marked [{existingOption.Content}].", true, true);
            if (await _bingoRepository.IsBingo()) await DispatchSystemMessage($"BINGO!", true, true);
            return true;
        }

        public async Task<bool> ResetBingo()
        {
            await ShouldGrantAccess();
            var isReset = await _bingoRepository.ResetBingo();
            await Clients.All.SendAsync("BingoReset");
            return isReset;
        }
        #endregion

        #region Admin
        public async Task<bool> SaveConfig([FromBody] Configuration updatedConfiguration)
        {
            await ShouldGrantAccess();
            var (updated, updatedSources) = await _configurationRepository.SaveAsync(updatedConfiguration);
            _configurationSigleton.Configuration = updatedConfiguration;
            await _hubContext.Clients.All.SendAsync("ConfigUpdated", updatedConfiguration);
            if (updatedSources) ScheduleBackgroundJobs();
            return updated;
        }

        private void ScheduleBackgroundJobs()
        {
            static string dateToCron(DateTime scheduledTime) => $"{scheduledTime.Minute} {scheduledTime.Hour} {scheduledTime.Day} {scheduledTime.Month} *";
            var UtcNow = DateTime.UtcNow;

            foreach (var source in _configurationSigleton.Configuration.Sources)
            {
                if (source.StartsAt > UtcNow)
                {
                    RecurringJob.AddOrUpdate(
                        $"{source.Name}-enable", 
                        () => ChangeSourceStatusBackground(Constants.FIREANDFORGET_TOKEN, source.Name, true, source.ResetOnScheduledSwitch)
                        , dateToCron(source.StartsAt.Value));
                }
                else RecurringJob.RemoveIfExists($"{source.Name}-enable");

                if (source.EndsAt > UtcNow)
                {
                    RecurringJob.AddOrUpdate(
                        $"{source.Name}-disable", 
                        () => ChangeSourceStatusBackground(Constants.FIREANDFORGET_TOKEN, source.Name, false, false), 
                        dateToCron(source.EndsAt.Value));
                }
                else RecurringJob.RemoveIfExists($"{source.Name}-disable");
            }
        }

        public async Task ChangeSourceStatusBackground(string VerificationToken, string sourceName, bool status, bool resetOnScheduledSwitch)
        {
            if (VerificationToken != Constants.FIREANDFORGET_TOKEN) throw new Exception("Permission denied");
            var sourceUpdated = false;
            try
            {
                sourceUpdated = await _sourceRepository.ChangeSourceStatus(sourceName, status);
            } catch (Exception) { }

            if (sourceUpdated)
            {
                _configurationSigleton.Configuration.Sources = await _sourceRepository.GetAll();
                if (status && resetOnScheduledSwitch)
                {
                    await DispatchSystemMessage($"[SYSTEM] Restarting media server. Playback will automatically resume shortly.", true, true);
                    string cmdResult = null;
                    try
                    {
                        //cmdResult = await ProcessHelper.DockerRestart();
                    } catch (Exception ex) { cmdResult = ex.Message; }
                    await DispatchSystemMessage(cmdResult, true, false, GetAdminSessions());
                }
                await _hubContext.Clients.All.SendAsync("ConfigUpdated", _configurationSigleton.Configuration);
            }

            await DispatchSystemMessage($"{(sourceUpdated ? "Executed" : "Could not execute")} scheduled job for [{sourceName}, {status}]", true, false, GetAdminSessions());
            RecurringJob.RemoveIfExists($"{sourceName}-{(status ? "enable" : "disable")}");
        }

        public async Task<object> GetOrderedConfig()
        {
            await ShouldGrantAccess();
            var unorderedConfig = (Configuration)Configuration.Clone();
            unorderedConfig.OBSPasswordtNotMapped = unorderedConfig.OBSPassword;
            unorderedConfig.OBSHostNotMapped = unorderedConfig.OBSHost;
            unorderedConfig.VAPIDPrivateKeyNotMapped = unorderedConfig.VAPIDPrivateKey;
            unorderedConfig.VAPIDMailNotMapped = unorderedConfig.VAPIDMail;
            unorderedConfig.IPServiceApiKeyNotMapped = unorderedConfig.IPServiceApiKey;
            unorderedConfig.BTCServerApiKeyNotMapped = unorderedConfig.BTCServerApiKey;
            unorderedConfig.BTCServerWebhookSecretNotMapped = unorderedConfig.BTCServerWebhookSecret;
            unorderedConfig.StripeSecretKeyNotMapped = unorderedConfig.StripeSecretKey;
            unorderedConfig.StripeWebhookSecretNotMapped = unorderedConfig.StripeWebhookSecret;
            unorderedConfig.TurnstileSecretKeyNotMapped = unorderedConfig.TurnstileSecretKey;
            return new
            {
                OrderedConfig = Configuration.BuildJSONConfiguration(),
                UnorderedConfig = unorderedConfig,
                OpenKey = nameof(unorderedConfig.OpenAt).ToLower(),
                TableKeys = new string[] 
                {
                    nameof(unorderedConfig.Sources).ToLower(),
                },
                ColorPickerKeys = new string[]
                {
                    nameof(unorderedConfig.PalettePrimary).ToLower(),
                    nameof(unorderedConfig.PaletteSecondary).ToLower()
                }
            };
        }

        public async Task<bool> RemoveEmote(int EmoteId)
        {
            await ShouldGrantAccess();
            var result = await _emoteRepository.Remove(EmoteId);
            await Clients.All.SendAsync("EmoteRemoved", EmoteId);
            return result;
        }

        public async Task<List<object>> ListActiveUsers()
        {
            if (!Configuration.ShowConnectedUsers) await ShouldGrantAccess();
            var users = ActiveConnections.OrderBy(ac => ac.Value.ConnectedAt).DistinctBy(ac => ac.Value.Session.SessionId).Select(ac => (object)new
            {
                ac.Value.Session.SessionId,
                ac.Value.Session.SessionNames.Last().Name,
            }).ToList();
            return users;
        }
        #endregion

        #region Push notifications
        public async Task<bool> SubscribeToPush([FromBody] string Endpoint, [FromBody] string P256, [FromBody] string Auth)
        {
            var result = await _notificationRepository.Add(GetCurrentConnection().Session.SessionId, Endpoint, P256, Auth);
            return result;
        }

        public async Task<string> DispatchPushNotifications()
        {
            await ShouldGrantAccess();
            var result = await _notificationRepository.SendAll();
            return result;
        }
        #endregion

        #region Ping
        public async Task Ping([FromBody] long Timestamp) => await Clients.Caller.SendAsync("Pong", Timestamp);

        public async Task ConfirmPingReception([FromBody] string PingId, [FromBody] bool ConfirmSeen)
        {
            if (_pings.All.TryGetValue(PingId, out var Ping) && ((!Ping.ConfirmedReception && !ConfirmSeen) || (!Ping.ConfirmedSeen && ConfirmSeen)))
            {
                var targets = ActiveConnections.Where(ac => ac.Value.Session.SessionId == Ping.SentBy)
                                               .Select(ac => ac.Key);

                await DispatchSystemMessage($"ID {Ping.Target}: ping {(ConfirmSeen ? "seen" : "received")}.", true, false, targets);
                if (ConfirmSeen) Ping.ConfirmedSeen = true;
                else Ping.ConfirmedReception = true;
            }
        }
        #endregion

        #region Golden pass
        public async Task<string> BeginPurchase(bool isCrypto)
        {
            string? response;
            try
            {
                var session = GetCurrentConnection().Session;
                if (isCrypto)
                {
                    if (Configuration.EnableBTCServer)
                    {
                        response = await _btcServerRepository.GenerateInvoice(session.SessionNames.Last().Name, session.SessionId);
                    }
                    else response = "Error: BTCServer is disabled.";
                }
                else
                {
                    if (Configuration.EnableStripe)
                    {
                        var host = Context.GetHttpContext()?.Request.Host.Value ?? string.Empty;
                        response = await _stripeRepository.GenerateInvoice(session.SessionNames.Last().Name, session.SessionId, host);
                    }
                    else response = "Error: Stripe is disabled.";
                }
            }
            catch (Exception ex)
            {
                response = $"Error: {ex.Message}";
            }
            return response;
        }

        public async Task<List<InvoiceDTO>?> GetSessionInvoices()
        {
            var sessionId = GetCurrentConnection().Session.SessionId;
            List<Task<List<InvoiceDTO>?>> invoices = [];
            if (Configuration.EnableBTCServer) invoices.Add(_btcServerRepository.GetInvoices(sessionId));
            // Retrieving invoices from stripe currently not implemented because Stripe's list API is a mess
            // if (Configuration.EnableStripe) invoices.Add(_stripeRepository.GetInvoices(sessionId));
            var result = await Task.WhenAll(invoices);
            return result.SelectMany(task => task ?? []).ToList();
        }
        #endregion

        #region Media server
        public async Task<MediaServerStream?> AddMediaServerStream([FromBody] MediaServerStream MediaServerStream)
        {
            await ShouldGrantAccess();
            return await _mediaServerStreamRepository.Add(MediaServerStream);
        }

        public async Task<bool> RemoveMediaServerStream([FromBody] int MediaServerStreamId)
        {
            await ShouldGrantAccess();
            var removed = await _mediaServerStreamRepository.Remove(MediaServerStreamId);
            await _processRepository.StopStreamProcess(removed);
            return true;
        }

        public async Task<bool> EditMediaServerStream([FromBody] MediaServerStream MediaServerStream)
        {
            await ShouldGrantAccess();
            var streamName = MediaServerStream.Name;
            var statusBeforeEdit = (await _mediaServerStreamRepository.GetByName(streamName))!.IsEnabled;
            var edited = await _mediaServerStreamRepository.Edit(MediaServerStream);

            await _processRepository.StopStreamProcess(MediaServerStream.Name);
            if (MediaServerStream.IsEnabled && statusBeforeEdit == false)
            {
                await Task.Delay(1000);
                _processRepository.InitStreamProcess(MediaServerStream);
            }

            return edited;
        }

        public async Task<List<MediaServerStream>> GetAllMediaServerStreams()
        {
            await ShouldGrantAccess();
            return await _mediaServerStreamRepository.GetAll();
        }
        #endregion

        #region Private methods
        private async Task<bool> ShouldGrantAccess(bool modActionAllowed = false)
        {
            var session = GetCurrentConnection().Session;
            if (!session.IsAdmin && (!session.IsMod || !modActionAllowed))
            {
                await DispatchSystemMessage("Permission denied.");
                throw new Exception("Access denied.");
            }

            return true;
        }

        private async Task TriggerUserCountChange(bool SelfInvoked, Session? session, int? sessionId)
        {
            int byIp = ActiveConnections.DistinctBy(connection => connection.Value.RemoteAdress).Count();
            var obj = new
            {
                ByConnection = ActiveConnections.DistinctBy(connection => connection.Key).Count(),
                byIp,
            };

            if (SelfInvoked) await Clients.Caller.SendAsync("UserCountChange", obj);
            else
            {
                await Clients.All.SendAsync("UserCountChange", obj);
                // Session being different to null means it's a connected event
                if (session != null) await SendAdminUserStatusUpdate(session);
                else if (!ActiveConnections.Any(ac => ac.Value.Session.SessionId == sessionId))
                {
                    await SendAdminUserStatusUpdate(sessionId: sessionId);
                }
            }
        }

        private async Task TriggerSourceViewerCountChange(bool SelfInvoked)
        {
            var values = Configuration.Sources.Where(source => source.IsEnabled)
                                               .Select(source => new
                                               {
                                                   name = source.Name,
                                                   count = ActiveConnections.Where(ac => ac.Value.QueryParams == source.Name)
                                                                            .DistinctBy(ac => ac.Value.RemoteAdress)
                                                                            .Count()
                                               });
            if (SelfInvoked) await Clients.Caller.SendAsync("SourceViewerCountChange", values);
            else await Clients.All.SendAsync("SourceViewerCountChange", values);
        }


        private async Task SendAdminUserStatusUpdate(Session? session = null, int? sessionId = null)
        {
            var admins = GetAdminSessions();
            var eventType = session != null ? "UserConnected" : "UserDisconnected";
            object? value = session != null ? new
            {
                session.SessionId,
                session.SessionNames.Last().Name,
                session.IsAdmin,
            } : sessionId;
            
            if (Configuration.ShowConnectedUsers) await Clients.All.SendAsync(eventType, value);
            else await Clients.Clients(admins).SendAsync(eventType, value);
        }

        private async Task<string?> IsChatActionAllowed(string Post)
        {
            await AbortIfBanned();
            var connection = GetCurrentConnection();
            if (connection.Session.IsAdmin) return null;
            if (!Configuration.ChatEnabled)
            {
                return "Chat is temporarily disabled.";
            }

            var MutedUntil = connection.Session.MutedUntil.GetValueOrDefault();
            var difference = DateTime.UtcNow.Subtract(MutedUntil).TotalMinutes;
            if (difference < 0)
            {
                var timeDifference = MutedUntil.Subtract(DateTime.UtcNow);
                var minuteDifference = Math.Ceiling(timeDifference.TotalMinutes);
                return $"You have been muted for {minuteDifference} {(minuteDifference == 1 ? "minute" : "minutes")}.";
            }

            if (connection.Session.IsGolden) return null;

            if (Configuration.EnableVerifiedMode && !connection.Session.IsVerified)
            {
                return "Error: Chat is currently restricted to verified users only.";
            }

            int requiredSessionTime = Configuration.RequiredTokenTimeInMinutes;
            var minutesDifference = DateTime.UtcNow.Subtract(connection.Session.CreatedAt).TotalMinutes;
            if (minutesDifference < requiredSessionTime)
            {
                var diff = Math.Ceiling(requiredSessionTime - minutesDifference);
                return $"You account is too new to post. You need to wait {diff} more {(diff == 1 ? "minute" : "minutes")}.";
            }

            var shouldEnforceCooldown = await _messageRepository.ShouldEnforceCooldown(connection.RemoteAdress);
            if (shouldEnforceCooldown != null)
            {
                return shouldEnforceCooldown;
            }

            if (connection.Session.IsVerified) return null;

            if (Configuration.ChatBlockTORConnections && await _torExitNodeRepository.IsTorExitNode(connection.RemoteAdress))
            {
                return $"Error: {Constants.TOR_DISABLED_MESSAGE}";
            }

            if (Configuration.ChatBlockVPNConnections && await _vpnAddressRepository.IsVpnAddress(connection.RemoteAdress))
            {
                return $"Error: {Constants.VPN_DISABLED_MESSAGE}";
            }

            var linkMatches = URLRegex().Matches(Post.ToLower()).Count;
            if (linkMatches == 0) return null;
            
            int requiredSessionTimeForLinks = Configuration.RequiredTimeToPostLinksMinutes;
            if (minutesDifference < requiredSessionTimeForLinks)
            {
                var diff = Math.Ceiling(requiredSessionTimeForLinks - minutesDifference);
                return $"You account is too new to post links. You need to wait {diff} more {(diff == 1 ? "minute" : "minutes")}.";
            }

            if (requiredSessionTimeForLinks == -1)
            {
                return $"Posting links by unverified users is temporarily disabled.";
            }

            return null;
        }

        private async Task DispatchUpdatedVoteCount()
        {
            var poll = await _pollRepository.GetExistingOrNew(false);
            var votes = poll.Options.Select(option => new { pollOptionId = option.PollOptionId, count = option.VoteCount });
            await Clients.All.SendAsync("VoteUpdate", votes);
        }

        private async Task<string?> CanUsePoll()
        {
            var Connection = GetCurrentConnection();
            var Session = Connection.Session;
            if (Session.IsAdmin) return null;

            var notAllowedMessage = await IsChatActionAllowed(string.Empty);
            if (notAllowedMessage != null) return notAllowedMessage;

            var MinCount = Configuration.MinSentToParticipate;
            if (!await _messageRepository.HasEnoughCountBySessionId(Session.SessionId, MinCount))
            {
                return $"You need to have sent at least {MinCount} messages in total to use this feature.";
            }

            return null;
        }

        private int GetBingoOptionVoteCount(int BingoSuggestionId)
        {
            var suggestions = _bingoSuggestions.All;
            var utcNow = DateTime.UtcNow;
            var keysToRemove = suggestions.Where(suggestion => (utcNow - suggestion.Value.Timestamp).TotalSeconds >= Configuration.AutoMarkingSecondsThreshold)
                              .Select(suggestion => suggestion.Key);

            foreach (var key in keysToRemove) suggestions.TryRemove(key, out _);

            return _bingoSuggestions.All.Where(suggestion => suggestion.Value.BingoSuggestionId == BingoSuggestionId)
                                        .DistinctBy(suggestion => suggestion.Value.RemoteAddress).Count();
        }

        private bool CanVote(string RemoteAddress, int BingoSuggestionId) =>
            !_bingoSuggestions.All.Any(bS => bS.Value.RemoteAddress == RemoteAddress && bS.Value.BingoSuggestionId == BingoSuggestionId);

        private bool ShouldTriggerBingoAutoMarking (string RemoteAddress, int BingoSuggestionId)
        {
            if (!Configuration.EnableAutoBingoMarking) return false;
            if (CanVote(RemoteAddress, BingoSuggestionId))
            {
                _bingoSuggestions.All.TryAdd(Guid.NewGuid().ToString(), new BingoSuggestion
                {
                    BingoSuggestionId = BingoSuggestionId,
                    RemoteAddress = RemoteAddress,
                    Timestamp = DateTime.UtcNow
                });
            }

            return GetBingoOptionVoteCount(BingoSuggestionId) >= Configuration.AutoMarkingUserCountThreshold;
        }

        private async Task NotifyNewMessage(Message message) =>
            await _hubContext.Clients.All.SendAsync("ChatMessage", message);

        private async Task DispatchSystemMessage(string Message, bool useCallers = false, bool useAll = false, IEnumerable<string>? Callers = null)
        {
            var obj = new Message
            {
                Content = Message,
                CreatedAt = DateTime.UtcNow,
                MessageType = "SystemMessage",
                MessageId = new Random().Next(),
                SessionId = 0,
                UserColorDisplay = null,
            };

            var Action = "ChatMessage";
            if (!useCallers) await Clients.Caller.SendAsync(Action, obj);
            else if (useAll) await _hubContext.Clients.All.SendAsync(Action, obj);
            else if (Callers != null) await _hubContext.Clients.Clients(Callers).SendAsync(Action, obj);
        }

        private async Task<bool> PerformBan(int SessionId, bool IsSilent, bool SilentDelete, int bannedBy)
        {
            var result = await _banRepository.Ban(SessionId, bannedBy);
            if (result == null) return false;
            var connectionsToRemove = ActiveConnections.Where(ac => result.SessionIPs.Any(SessionIP => SessionIP.RemoteAddress == ac.Value.RemoteAdress) && !ac.Value.Session.IsAdmin)
                                                       .Select(ac => ac.Key);
            await ForceDisconnect(connectionsToRemove, "You have been banned.");
            if (!IsSilent || (IsSilent && SilentDelete))
            {
                await NotifyNewMessage(new Message
                {
                    Content = SilentDelete ? "" : $"{result.SessionNames.Last().Name} was removed from chat",
                    CreatedAt = DateTime.UtcNow,
                    MessageType = "UserBanned",
                    SessionId = SessionId,
                    MessageId = new Random().Next()
                });
            }
            return true;
        }

        private async Task AbortIfBanned()
        {
            var Connection = GetCurrentConnection();
            if (Connection.Session.IsAdmin) return;
            var IsVerified = Connection.Session.IsVerified;
            var IsBanned = await _banRepository.IsBanned(Connection.RemoteAdress, Connection.Session.SessionToken);
            var triggeredVPNVerification = false;
            if (!IsVerified && (Configuration.SiteBlockVPNConnections || Configuration.ChatBlockVPNConnections))
            {
                triggeredVPNVerification = await _vpnAddressRepository.IsVpnAddress(Connection.RemoteAdress);
            }
            var IsVpnAndBlocked = !IsVerified && Configuration.SiteBlockVPNConnections && triggeredVPNVerification;
            var IsTorAndBlocked = !IsVerified && Configuration.SiteBlockTORConnections && await _torExitNodeRepository.IsTorExitNode(Connection.RemoteAdress);
            var NeedsTurnstile = await NeedsPassTurnstail(Connection.Session);
            string? message = null;
            
            if (IsBanned) message = Constants.BANNED_MESSAGE;
            else if (IsVpnAndBlocked) message = Constants.VPN_DISABLED_MESSAGE;
            else if (IsTorAndBlocked) message = Constants.TOR_DISABLED_MESSAGE;
            else if (NeedsTurnstile) message = Constants.TURNSTILE_REQUIRED;

            if (message != null)
            {
                await ForceDisconnect([Context.ConnectionId], message);
                Context.Abort();
                throw new Exception(string.Format("Forced disconnect: {0}", message));
            }
        }

        private async Task ForceDisconnect(IEnumerable<string> connectionsToRemove, object Message) =>
            await _hubContext.Clients.Clients(connectionsToRemove).SendAsync("ForceDisconnect", Message);

        private async Task<bool> DispatchCommand(string message, SignalRConnection connection)
        {
            if (!connection.Session.IsAdmin) return false;
            try
            {
                switch (message)
                {
                    case string _message when _message.StartsWith(Constants.PING_COMMAND):
                        await SendPing(message, connection);
                        return true;
                    case string _message when _message.StartsWith(Constants.PLAY_COMMAND):
                        await SendOBSCommand(message);
                        return true;
                    case string _message when _message.StartsWith(Constants.TRY_IP_SERVICE_COMMAND):
                        await TryIPService(connection.RemoteAdress, message);
                        return true;
                    case string _message when _message.StartsWith(Constants.RESET_VPN_RECORDS):
                        await ResetVPNRecords();
                        return true;
                    case string _message when _message.StartsWith(Constants.DOCKER_RESTART):
                        await DockerRestart();
                        return true;
                    case string _message when _message.StartsWith(Constants.REDIRECT_SOURCE):
                        await RedirectFromSource(message);
                        return true;
                    default:
                        return false;
                }
            }
            catch (Exception ex)
            {
                await DispatchSystemMessage($"Could not dispatch command: {ex.Message}");
                return true;
            }
        }

        private async Task SendPing(string message, SignalRConnection connection)
        {
            var Matches = PingRegex().Matches(message);
            var ID = int.Parse(Matches[0].Groups[1].Value);
            var text = Matches[0].Groups[2].Value;

            var targets = ActiveConnections.Where(ac => ac.Value.Session.SessionId == ID).Select(ac => ac.Key);
            if (!targets.Any()) return;
            var pingId = Guid.NewGuid().ToString();
            await Clients.Clients(targets).SendAsync("Ping", new
            {
                text,
                PingId = pingId,
                connection.Session.SessionNames.Last().Name
            });

            _pings.All.TryAdd(pingId, new Ping
            {
                SentBy = connection.Session.SessionId,
                Target = ID,
            });
        }

        private async Task SendOBSCommand(string message)
        {
            var matches = OBSRegex().Matches(message);
            string? url = null;
            if (matches.Count != 0)
            {
                url = matches[0].Value.Trim();
                bool result = Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                    && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
                if (!result) throw new Exception("Invalid url.");
            }
            switch (message)
            {
                case string _message when _message.StartsWith(Constants.PLAY_MAIN_COMMAND):
                    await DispatchSystemMessage($"Executing {Constants.PLAY_MAIN_COMMAND} command...");
                    await _obsCommandsRepository.PlayMain(url);
                    await DispatchSystemMessage($"Successfully executed {Constants.PLAY_MAIN_COMMAND}.");
                    break;
                case string _message when _message.StartsWith(Constants.PLAY_KINO_COMMAND):
                    await DispatchSystemMessage($"Executing {Constants.PLAY_KINO_COMMAND} command...");
                    await _obsCommandsRepository.PlayKino(url);
                    await DispatchSystemMessage($"Successfully executed {Constants.PLAY_KINO_COMMAND}.");
                    break;
                case string _message when _message.StartsWith(Constants.PLAY_MUSIC_MAIN_MUTED):
                    await DispatchSystemMessage($"Executing {Constants.PLAY_MUSIC_MAIN_MUTED} command...");
                    await _obsCommandsRepository.PlayMusic(url);
                    await DispatchSystemMessage($"Successfully executed {Constants.PLAY_MUSIC_MAIN_MUTED}.");
                    break;
                default: throw new NotImplementedException();
            }
        }

        private async Task TryIPService(string RemoteAddress, string Message)
        {
            var matches = OBSRegex().Matches(Message);
            if (matches.Count != 0) RemoteAddress = matches[0].Value.Trim();
            await DispatchSystemMessage($"Executing {Constants.TRY_IP_SERVICE_COMMAND} command...");
            string? result;
            try
            {
                result = await _vpnAddressRepository.InvokeVerificationService(RemoteAddress);
                result = JToken.Parse(result).ToString(Formatting.Indented);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            await DispatchSystemMessage(result);
        }

        private async Task ResetVPNRecords()
        {
            await DispatchSystemMessage($"Executing {Constants.RESET_VPN_RECORDS} command...");
            try
            {
                var result = await _vpnAddressRepository.ResetRecords();
                await DispatchSystemMessage($"Removed {result} records");
            }
            catch (Exception ex)
            {
                await DispatchSystemMessage(ex.Message);
            }
        }


        private async Task DockerRestart()
        {
            await DispatchSystemMessage($"Executing {Constants.DOCKER_RESTART} command...");
            try
            {
                await DispatchSystemMessage($"[SYSTEM] Restarting media server. Playback will automatically resume shortly.", true, true);
                //var result = await ProcessHelper.DockerRestart();
                await DispatchSystemMessage("");
            }
            catch (Exception ex)
            {
                await DispatchSystemMessage(ex.Message);
            }
        }

        private async Task RedirectFromSource(string Message)
        {
            await DispatchSystemMessage($"Executing {Constants.REDIRECT_SOURCE} command...");
            try
            {
                var strings = Message.Split(" ");
                var from = strings[1].Trim().ToLower();
                var to = strings[2].Trim().ToLower();

                var isFromValid = await _sourceRepository.ExistsByName(from);
                var isToValid = await _sourceRepository.ExistsByName(to);
                if (!isFromValid || !isToValid)
                {
                    await DispatchSystemMessage($"One or more sources are invalid [{from}] [{to}]"); 
                    return;  
                }

                await Clients.All.SendAsync("RedirectSource", new
                {
                    from,
                    to,
                });
                await DispatchSystemMessage($"Redirected users from {from} to {to}");
            }
            catch (Exception ex)
            {
                await DispatchSystemMessage(ex.Message);
            }
        }

        private async Task<bool> NeedsPassTurnstail(Session? session)
        {
           return Configuration.EnableTurnstileMode 
                && !Configuration.TurnstileManagedMode
                && session != null
                && !session.PassedTurnstile
                && !session.IsVerified
                && !session.IsMod
                && !session.IsAdmin
                && !session.IsGolden
                && !await _messageRepository.HasEnoughCountBySessionId(session.SessionId, (int)Configuration.TurnstileSkipThreshold);
        }

        private string NormalizeString(string input) =>
            Configuration.StripNonASCIIChars 
            ? ASCIIRegex().Replace(input.Trim().Normalize(NormalizationForm.FormKD).Normalize(NormalizationForm.FormC), "")
            : input.Trim();

        [GeneratedRegex(@"(\d+) (.+)$")]
        private static partial Regex PingRegex();

        [GeneratedRegex(@"\s+(.+)$")]
        private static partial Regex OBSRegex();

        [GeneratedRegex("https?://\\S+")]
        private static partial Regex URLRegex();

        [GeneratedRegex(@"[^\x20-\x7F\u00C0-\u00FF\u0100-\u017F]+")]
        private static partial Regex ASCIIRegex();
        #endregion
    }
}
