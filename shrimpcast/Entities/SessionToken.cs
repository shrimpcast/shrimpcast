namespace shrimpcast.Entities
{
    public class SessionToken
    {
        private const int _LookupKeyLength = 16;

        public required string Hash { get; set; }

        public required string Plain { get; set; }

        public string LookupKey
        {
            get
            {
                if (Plain.Length < _LookupKeyLength)
                {
                    return string.Empty;
                }

                return Plain[^_LookupKeyLength..];
            }
        }
    }
}
