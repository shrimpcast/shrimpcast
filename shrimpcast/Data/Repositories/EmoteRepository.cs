using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class EmoteRepository(APPContext context) : IEmoteRepository
    {
        private readonly APPContext _context = context;

        public async Task<object> GetAll()
        {
            var emotes = await _context.Emotes.AsNoTracking().Select(emote => new
            {
                emote.EmoteId,
                name = $":{emote.Name}:",
                url = Constants.EMOTE_GET(emote.Name),
            }).ToListAsync();
            return emotes;
        }

        public async Task<Emote> Get(string name)
        {
            var emote = await _context.Emotes.AsNoTracking().FirstAsync(emote => emote.Name == name);
            return emote;
        }

        public async Task<object> Add(IFormFile emote, string name)
        {
            if (await ExistsByName(name)) throw new Exception("Emote already exists.");
            byte[] emoteBytes;
            using (var ms = new MemoryStream())
            {
                await emote.CopyToAsync(ms);
                emoteBytes = ms.ToArray();
            }

            var Emote = new Emote()
            {
                Content = emoteBytes,
                Name = name,
                ContentType = emote.ContentType,
            };

            await _context.AddAsync(Emote);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? new
            {
                name = $":{name}:",
                url = Constants.EMOTE_GET(name),
                Emote.EmoteId,
            } : throw new Exception("Could not add emote.");
        }

        public async Task<bool> Remove(int EmoteId)
        {
            var Emote = await _context.Emotes.FirstAsync(emote => emote.EmoteId == EmoteId);
            _context.Emotes.Remove(Emote);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not remove emote.");
        }

        private async Task<bool> ExistsByName (string name) =>
             await _context.Emotes.AsNoTracking().AnyAsync(emote => emote.Name == name);
    }
}

