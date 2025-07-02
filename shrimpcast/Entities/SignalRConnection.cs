using shrimpcast.Entities.DB;

namespace shrimpcast.Entities
{
    public class SignalRConnection
    {
        public DateTime ConnectedAt { get; set; }

        public required string RemoteAdress { get; set; }

        public string? QueryParams { get; set; }

        public required Session Session { get; set; }
    }
}

