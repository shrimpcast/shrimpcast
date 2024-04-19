namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IOBSCommandsRepository
    {
        Task<bool> PlayMain(string? url);
        Task<bool> PlayKino(string? url);
        Task<bool> PlayMusic(string? url);
    }
}

