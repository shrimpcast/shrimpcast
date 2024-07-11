namespace shrimpcast.Entities.DB
{
    public class BingoOption
    {
        public int BingoOptionId { get; set; }

        public bool IsChecked { get; set; } 

        public DateTime CreatedAt { get; set; }

        public required string Content { get; set; }
    }
}

