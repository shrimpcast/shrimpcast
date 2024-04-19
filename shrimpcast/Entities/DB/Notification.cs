using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class Notification
    {
        public int NotificationId { get; set; }

        [JsonIgnore]
        public Session? Session { get; set; }

        public required int SessionId { get; set; }

        public required string Endpoint { get; set; }

        public required string P256 { get; set; }

        public required string Auth { get; set; }
    }
}

