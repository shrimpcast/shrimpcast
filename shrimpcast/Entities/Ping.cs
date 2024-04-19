namespace shrimpcast.Entities
{
    public class Ping
    {
        public bool ConfirmedReception { get; set; }
        public bool ConfirmedSeen { get; set; }
        public int SentBy { get; set; }
        public int Target { get; set; }
    }
}

