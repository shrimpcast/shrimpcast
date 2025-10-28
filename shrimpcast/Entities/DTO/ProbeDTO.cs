namespace shrimpcast.Entities.DTO
{
    public class ProbeDTO
    {
        public required string SessionToken { get; set; }

        public required string URL { get; set; }

        public List<HeaderDTO>? CustomHeaders { get; set; }
    }
}
