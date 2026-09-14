using shrimpcast.Entities.DB;

namespace shrimpcast.Entities.DTO
{
    public class MediaServerStreamDTO
    {
        public required string SessionToken { get; set; }

        public required MediaServerStream MediaServerStream { get; set; }
    }
}
