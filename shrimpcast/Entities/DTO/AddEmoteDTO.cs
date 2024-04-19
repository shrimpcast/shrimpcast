namespace shrimpcast.Entities.DTO
{
    public class AddEmoteDTO
    {
        public required IFormFile Emote { get; set; }

        public required string Name { get; set; }

        public required string AccessToken { get; set; }
    }
}
