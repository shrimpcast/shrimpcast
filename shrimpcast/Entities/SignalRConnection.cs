using shrimpcast.Entities.DB;

namespace shrimpcast.Entities
{
    public class SignalRConnection
    {
        public DateTime ConnectedAt { get; set; }

        public required string RemoteAdress { get; set; }

        public string? QueryParams { get; set; }

        public DateTime LastPing { get; set; } = DateTime.UtcNow;

        public required Session Session { get; set; }
    }
}

