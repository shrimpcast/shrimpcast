using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(Name), IsUnique = true)]
    public class Source
    {
        public int SourceId { get; set; }

        public required string Name { get; set; }

        public required string Url { get; set; }

        public string? Thumbnail { get; set; }

        public bool IsEnabled { get; set; }

        public required bool UseLegacyPlayer { get; set; }

        public required bool UseRTCEmbed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
