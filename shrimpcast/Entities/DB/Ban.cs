using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class Ban
    {
        public int BanId { get; set; }

        public int SessionId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int BannedBy { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public Session? Session { get; set; }

        [NotMapped]
        public string? SessionName { get; set; }
    }
}

