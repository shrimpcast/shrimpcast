using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(Content))]
    public class AutoModFilter
    {
        public int AutoModFilterId { get; set; }

        public required string Content { get; set; }

        public required bool IgnoreCase { get; set; }

        public required bool IgnoreDiacritic { get; set; }
    }
}
