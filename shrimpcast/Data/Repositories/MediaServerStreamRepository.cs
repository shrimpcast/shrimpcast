using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class MediaServerStreamRepository(APPContext context) : IMediaServerStreamRepository
    {
        private readonly APPContext _context = context;

        public async Task<MediaServerStream?> Add(MediaServerStream mediaServerStream)
        {
            if (_context.MediaServerStreams.AsNoTracking().FirstOrDefault(m => m.Name == mediaServerStream.Name) != null) return null;
            await _context.AddAsync(mediaServerStream);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? mediaServerStream : throw new Exception("Could not add media server stream.");
        }

        public async Task<List<MediaServerStream>> GetAll() =>
            await _context.MediaServerStreams.AsNoTracking().ToListAsync();

        public async Task<List<MediaServerStream>> GetEnabled() =>
            await _context.MediaServerStreams.AsNoTracking().Where(m => m.IsEnabled).ToListAsync();

        public async Task<MediaServerStream?> GetByName(string Name) =>
            await _context.MediaServerStreams.AsNoTracking().FirstOrDefaultAsync(m => m.Name == Name);

        public async Task<bool> Edit(MediaServerStream _mediaServerStream)
        {
            var mediaServerStream = await _context.MediaServerStreams.FirstAsync(m => m.MediaServerStreamId == _mediaServerStream.MediaServerStreamId);
            _context.Entry(mediaServerStream).CurrentValues.SetValues(_mediaServerStream);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<string> Remove(int MediaServerStreamId)
        {
            var mediaServerStream = await _context.MediaServerStreams.FirstAsync(m => m.MediaServerStreamId == MediaServerStreamId);
            _context.MediaServerStreams.Remove(mediaServerStream);
            return await _context.SaveChangesAsync() > 0 ? mediaServerStream.Name : throw new Exception("Could not remove item.");
        }
    }
}

