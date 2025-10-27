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

        public async Task<List<MediaServerStream>> GetAll()
        {
            var query = _context.MediaServerStreams.AsNoTracking();
            return await query.ToListAsync();
        }

        public async Task<bool> Edit(MediaServerStream _mediaServerStream)
        {
            var mediaServerStream = await _context.MediaServerStreams.FirstAsync(m => m.MediaServerStreamId == _mediaServerStream.MediaServerStreamId);
            _context.Entry(mediaServerStream).CurrentValues.SetValues(_mediaServerStream);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Remove(int MediaServerStreamId)
        {
            var mediaServerStream = await _context.MediaServerStreams.Where(m => m.MediaServerStreamId == MediaServerStreamId).FirstAsync();
            _context.MediaServerStreams.Remove(mediaServerStream);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

