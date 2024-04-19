namespace shrimpcast.Entities.DB
{
    public class Poll
    {
        public int PollId { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<PollOption> Options { get; set; } = new List<PollOption>();
    }
}

