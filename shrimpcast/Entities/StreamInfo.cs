using shrimpcast.Entities.DB;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net;

namespace shrimpcast.Entities
{
    public class StreamInfo
    {
        public required Process Process { get; set; }
        public required MediaServerStream Stream { get; set; }
        public required string StreamPath { get; set; }
        public required string FullStreamPath { get; set; }
        public required string LaunchCommand { get; set; }
        public ConcurrentQueue<(DateTime AddedAt, string Content)> Logs { get; set; } = [];
        public DateTime? LastScreenshot { get; set; }
        public required DateTime StartTime { get; set; }
        public int Bitrate { get; set; }
        public (TimeSpan CpuTime, DateTime Time)? ProcessorUsage { get; set; }
        public string? ProcessorUsageComputed { get; set; }
        public ConcurrentDictionary<IPAddress, DateTime> Viewers { get; set; } = [];
    }
}

