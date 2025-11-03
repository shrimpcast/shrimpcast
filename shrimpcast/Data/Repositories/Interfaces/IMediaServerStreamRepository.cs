using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IMediaServerStreamRepository
    {
        Task<MediaServerStream?> Add(MediaServerStream mediaServerStream);
        Task<List<MediaServerStream>> GetAll();
        Task<List<MediaServerStream>> GetEnabled();
        Task<MediaServerStream?> GetByName(string Name);
        Task<string> Remove(int MediaServerStreamId);
        Task<bool> Edit(MediaServerStream mediaServerStream);
    }
}