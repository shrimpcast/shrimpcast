namespace shrimpcast.Entities
{
    public class BingoSuggestion
    {
        public required int BingoSuggestionId { get; set; }

        public required DateTime Timestamp { get; set; }

        public required string RemoteAddress { get; set; }
    }
}

