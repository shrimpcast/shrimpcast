namespace shrimpcast.Entities
{
    public class LBMetric
    {
        public required string InstanceName { get; set; }
        public string? RemoteAddress { get; set; }
        public string? Host { get; set; }
        public required object Metrics { get; set; }
        public DateTime ReportTime { get; } = DateTime.UtcNow;
    }
}

