namespace shrimpcast.Entities.DB
{
    public class MediaServerStream
    {
        public int MediaServerStreamId { get; set; }

        public required bool IsEnabled { get; set; }

        public required string Name { get; set; }

        public required string IngressUri { get; set; }
    }
}
