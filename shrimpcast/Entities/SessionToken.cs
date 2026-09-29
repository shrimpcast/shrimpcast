namespace shrimpcast.Entities
{
    public class SessionToken
    {
        public required string Hash { get; set; }

        public required string Plain { get; set; }

        public string LookupKey
        {
            get
            {
                if (Plain.Length < 10) return string.Empty;
                return Plain[^10..];
            }
        }
    }
}
