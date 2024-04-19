using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class PollOption
    {
        public int PollOptionId { get; set; }

        public int PollId { get; set; } 

        public int SessionId { get; set; } 

        public required string Value { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public Poll? Poll { get; set; }

        [JsonIgnore]
        public Session? Session { get; set; }

        public List<PollVote>? Votes { get; set; }

        [NotMapped]
        public int VoteCount { get; set; }
    }
}

