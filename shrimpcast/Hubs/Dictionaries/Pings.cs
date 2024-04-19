using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class Pings<T> where T : Hub
    {
        public ConcurrentDictionary<string, Ping> All { get; } = new();
    }
}

