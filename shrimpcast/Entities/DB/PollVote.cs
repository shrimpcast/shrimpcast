using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class PollVote
    {
        public int PollVoteId { get; set; }

        public int PollOptionId { get; set; }

        public int SessionId { get; set; }

        public required string RemoteAddress { get; set; }

        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public PollOption? PollOption { get; set; }

        [JsonIgnore]
        public Session? Session { get; set; }
    }
}

