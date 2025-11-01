using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class MediaServerLogs<T> where T : Hub
    {
        public ConcurrentQueue<(DateTime AddedAt, string Content)> Logs { get; } = new();
    }
}
