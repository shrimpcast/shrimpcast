using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class RateLimits<T> where T : Hub
    {
        public ConcurrentDictionary<string, RateLimit> All { get; } = new();
        public readonly int periodSeconds = 10; 
        private DateTime _lastCleaned = DateTime.UtcNow;
        private readonly int _cleanupIntervalMinutes = 5;

        public int MaxSocketReqsPer10secs(int maxConnectionsPerIp)
        {
            var total = maxConnectionsPerIp * 10 + 5;
            return total > 100 ? 100 : total;
        }

        public void CleanupIfNeeded()
        {
            var now = DateTime.UtcNow;

            if ((now - _lastCleaned).TotalMinutes < _cleanupIntervalMinutes) return;
            _lastCleaned = now;
            var keysToRemove = new List<string>();

            foreach (var ratelimit in All)
            {
                var periodStartSecondsAgo = (now - ratelimit.Value.PeriodStart).TotalSeconds;
                if (periodStartSecondsAgo > periodSeconds * 2)
                {
                    keysToRemove.Add(ratelimit.Key);
                }
            }

            keysToRemove.ForEach(key => All.TryRemove(key, out _));
        }
    }
}