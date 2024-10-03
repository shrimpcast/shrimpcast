using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(CreatedAt), IsDescending = [true])]
    public class Message
    {
        public int MessageId { get; set; }

        [JsonIgnore]
        public Session? Session { get; set; }

        public required int SessionId { get; set; }

        [MaxLength(500)]
        public required string Content { get; set; }

        [JsonIgnore]
        public string RemoteAddress { get; set; } = string.Empty;

        public required DateTime CreatedAt { get; set; }

        public required string MessageType { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedAt { get; set; }

        public int DeletedBy { get; set; }

        [NotMapped]
        public string? UserColorDisplay { get; set; }

        [NotMapped]
        public string? SentBy { get; set; }

        [NotMapped]
        public bool IsAdmin { get; set; }

        [NotMapped]
        public bool IsMod { get; set; }

        [NotMapped]
        public bool IsGolden { get; set; }
    }
}

