using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(SessionId))]
    public class Session
    {
        public int SessionId { get; set; }

        public required string SessionToken { get; set; }

        public required DateTime CreatedAt { get; set; }

        public DateTime? MutedUntil { get; set; }

        public bool IsAdmin { get; set; }

        public bool IsModerator { get; set; }

        public required string UserDisplayColor { get; set; }

        public List<SessionName> SessionNames { get; set; } = new List<SessionName>();

        public List<SessionIP> SessionIPs { get; set; } = new List<SessionIP>();
    }
}

