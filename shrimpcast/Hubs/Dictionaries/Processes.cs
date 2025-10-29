using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class Processes<T> where T : Hub
    {
        public ConcurrentDictionary<string, StreamInfo> All { get; } = new();
    }
}
