using Microsoft.AspNetCore.SignalR;
using shrimpcast.Entities;
using System.Collections.Concurrent;

namespace shrimpcast.Hubs.Dictionaries
{
    public class BingoSuggestions<T> where T : Hub
    {
        public ConcurrentDictionary<string, BingoSuggestion> All { get; } = new();
    }
}

