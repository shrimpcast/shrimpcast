using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using shrimpcast.Hubs.Dictionaries;

namespace shrimpcast.Hubs.Filters
{
    public class RateLimiting(RateLimits<SiteHub> rateLimits, ConfigurationSingleton configurationSingleton, Connections<SiteHub> activeConnections) : IHubFilter
    {
        private readonly RateLimits<SiteHub> _rateLimits = rateLimits;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        private readonly Connections<SiteHub> _activeConnections = activeConnections;

        public async ValueTask<object?> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
        {
            await EnsureConnectionExists(invocationContext);
            await EnsureRateLimits(invocationContext);
            return await next(invocationContext);
        }

        private async Task EnsureRateLimits(HubInvocationContext hubInvocationContext)
        {
            var context = hubInvocationContext.Context;
            var remoteAddress = context.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress?.ToString();

            var now = DateTime.UtcNow;
            var exceeded = false;

            var rateLimiter = _rateLimits.All.GetOrAdd(remoteAddress!, new RateLimit());

            lock (rateLimiter)
            {
                var currentPeriodLength = (now - rateLimiter.PeriodStart).TotalSeconds;
                if (currentPeriodLength > _rateLimits.periodSeconds)
                {
                    rateLimiter.PeriodStart = now;
                    rateLimiter.RequestsWithinPeriod = 0;
                }

                rateLimiter.RequestsWithinPeriod++;

                var maxReqsPerPeriod = _rateLimits.MaxSocketReqsPer10secs(_configurationSingleton.Configuration.MaxConnectionsPerIP);
                if (rateLimiter.RequestsWithinPeriod > maxReqsPerPeriod)
                {
                    exceeded = true;
                }
            }

            if (exceeded)
            {
                await SendDisconnectReason(hubInvocationContext, Constants.RATE_LIMITED);
                context.Abort();
                throw new Exception(Constants.RATE_LIMITED);
            }
        }

        private async Task EnsureConnectionExists(HubInvocationContext hubInvocationContext)
        {
            var context = hubInvocationContext.Context;
            _activeConnections.All.TryGetValue(context.ConnectionId, out var Connection);
            if (Connection == null)
            {
                await SendDisconnectReason(hubInvocationContext, "Disconnected due to inactivity. Please reconnect with a new session.");
                context.Abort();
                throw new TimeoutException();
            }
            Connection.LastPing = DateTime.UtcNow;
        }

        private async Task SendDisconnectReason(HubInvocationContext hubInvocationContext, string message)
        {
            try
            {
                var context = hubInvocationContext.Context;
                await hubInvocationContext.Hub.Clients.Clients(context.ConnectionId).SendAsync("ForceDisconnect", message);
            }
            catch (Exception) { }
        }
    }
}
