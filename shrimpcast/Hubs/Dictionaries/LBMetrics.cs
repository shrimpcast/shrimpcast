using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class LBMetrics<T> where T : Hub
    {
        public ConcurrentDictionary<string, LBMetric> All { get; } = new();
    }
}
