using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(CreatedAt), IsDescending = [true])]
    public class SessionIP
    {
        public int SessionIPId { get; set; }

        public required int SessionId { get; set; }

        public required string RemoteAddress { get; set; }

        public required DateTime CreatedAt { get; set; }
    }
}

