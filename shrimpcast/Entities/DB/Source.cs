using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(Name), IsUnique = true)]
    public class Source
    {
        public int SourceId { get; set; }

        public required string Name { get; set; }

        public string? Title { get; set; }

        public required string Url { get; set; }

        public string? Thumbnail { get; set; }

        public bool IsEnabled { get; set; }

        public required bool UseLegacyPlayer { get; set; }

        public required bool UseRTCEmbed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? StartsAt {  get; set; }

        public DateTime? EndsAt {  get; set; }

        public required bool ResetOnScheduledSwitch { get; set; }

        public required bool WithCredentials { get; set; }

        public static object GetModel()
        {
            var model = typeof(Source).GetProperties()
                .Where(p => p.Name != "CreatedAt")
                .ToDictionary(
                    p => char.ToLowerInvariant(p.Name[0]) + p.Name[1..],
                    p => (object?)(p.PropertyType == typeof(string) ? string.Empty
                          : p.PropertyType == typeof(bool) ? false
                          : p.PropertyType == typeof(int) ? 0
                          : null)
                );
            return model;
        }
    }
}
