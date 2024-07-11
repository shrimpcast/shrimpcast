using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using System.Collections.Concurrent;
using WebPush;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class NotificationRepository(APPContext context, ConfigurationSingleton configurationSingleton) : INotificationRepository
    {
        private readonly APPContext _context = context;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async Task<bool> Add(int SessionId, string Endpoint, string P256, string Auth)
        {
            var Notification = new Notification 
            {
                SessionId = SessionId,
                Endpoint = Endpoint,
                P256 = P256,
                Auth = Auth,
            };

            await _context.AddAsync(Notification);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> Remove(int NotificationId)
        {
            var notification = await _context.Notifications.FirstAsync(notification => notification.NotificationId == NotificationId);
            _context.Notifications.Remove(notification);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Notification>> GetAll()
        {
            var notifications = await _context.Notifications.AsNoTracking().ToListAsync();
            return notifications;
        }

        public async Task<bool> ExistsById(int SessionId)
        {
            var exists = await _context.Notifications.AsNoTracking().FirstOrDefaultAsync(n => n.SessionId ==  SessionId);
            return exists != null;
        }

        public async Task<string> SendAll()
        {
            var notifications = await GetAll();
            var configuration = _configurationSingleton.Configuration;
            var webPushClient = new WebPushClient();
            ConcurrentBag<int> ToRemove = []; // Use ConcurrentBag for thread safety
            webPushClient.SetVapidDetails(configuration.VAPIDMail, configuration.VAPIDPublicKey, configuration.VAPIDPrivateKey);

            await Parallel.ForEachAsync(notifications, async (notification, ct) =>
            {
                var subscription = new PushSubscription(notification.Endpoint, notification.P256, notification.Auth);
                try
                {
                    await webPushClient.SendNotificationAsync(subscription, cancellationToken: ct);
                }
                catch (WebPushException e)
                {
                    if (e.Message.StartsWith("Subscription no longer valid."))
                    {
                        ToRemove.Add(notification.NotificationId);
                    }
                }
            });

            if (!ToRemove.IsEmpty)
            {
                await _context.Notifications.Where(notification => ToRemove.Contains(notification.NotificationId))
                                            .ExecuteDeleteAsync();
            }

            return $"{notifications.Count - ToRemove.Count} successful / {notifications.Count} total. ({ToRemove.Count} removed).";
        }
    }
}

