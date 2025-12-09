namespace shrimpcast.Entities
{
    public class LBMetric
    {
        public required string? AuthToken { get; set; }
        public required string InstanceName { get; set; }
        public string? RemoteAddress { get; set; }
        public required object Metrics { get; set; }
        public DateTime ReportTime { get; } = DateTime.UtcNow;
    }
}

