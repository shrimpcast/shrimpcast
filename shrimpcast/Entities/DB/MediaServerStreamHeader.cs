namespace shrimpcast.Entities.DB
{
    public class MediaServerStreamHeader
    {
        public int MediaServerStreamHeaderId { get; set; }

        public required int MediaServerStreamId { get; set; }

        public required string Header { get; set; }

        public required string Value { get; set; }
    }
}
