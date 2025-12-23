using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using shrimpcast.Hubs.Dictionaries;

namespace shrimpcast.Hubs.Filters
{
    public class RateLimiting(RateLimits<SiteHub> rateLimits, ConfigurationSingleton configurationSingleton) : IHubFilter
    {
        private readonly RateLimits<SiteHub> _rateLimits = rateLimits;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;

        public async ValueTask<object?> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
        {
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
                try
                {
                    await hubInvocationContext.Hub.Clients.Clients(context.ConnectionId).SendAsync("ForceDisconnect", Constants.RATE_LIMITED);
                } catch (Exception) { }
                context.Abort();
                throw new Exception(Constants.RATE_LIMITED);
            } 
        }
    }
}
