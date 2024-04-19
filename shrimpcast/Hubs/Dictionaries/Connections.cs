using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class Connections<T> where T : Hub
    {
        public ConcurrentDictionary<string, SignalRConnection> All { get; } = new();
    }
}

