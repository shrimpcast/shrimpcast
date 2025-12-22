namespace shrimpcast.Entities
{
    public class RateLimit
    {
        public DateTime PeriodStart { get; set; }
        public int RequestsWithinPeriod { get; set; } 
    }
}

