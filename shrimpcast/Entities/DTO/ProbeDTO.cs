using shrimpcast.Entities.DB;

namespace shrimpcast.Entities.DTO
{
    public class ProbeDTO
    {
        public required string SessionToken { get; set; }

        public required string URL { get; set; }

        public string? CustomHeaders { get; set; }

        public bool ForceHLS { get; set; }
    }
}
