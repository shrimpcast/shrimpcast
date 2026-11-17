namespace shrimpcast.Entities.DB
{
    public class Emote
    {
        public int EmoteId { get; set; }

        public required string Name { get; set; }

        public required string ContentType { get; set; }

        public required byte[] Content { get; set; }

        public required bool IsManualUpload { get; set; }
    }
}
