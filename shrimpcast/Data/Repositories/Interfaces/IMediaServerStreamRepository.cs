using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IMediaServerStreamRepository
    {
        Task<MediaServerStream?> Add(MediaServerStream mediaServerStream);
        Task<List<MediaServerStream>> GetAll();
        Task<bool> Remove(int MediaServerStreamId);
        Task<bool> Edit(MediaServerStream mediaServerStream);
    }
}