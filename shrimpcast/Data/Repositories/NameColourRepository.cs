using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class NameColourRepository : INameColourRepository
    {
        private readonly APPContext _context;

        public NameColourRepository(APPContext context)
        {
            _context = context;
        }

        public async Task<List<NameColour>> GetAll()
        {
            var colours = await _context.NameColours.ToListAsync();
            return colours;
        }

        public async Task<NameColour> GetById(int NameColourId)
        {
            var query = _context.NameColours.Where(nc => nc.NameColourId == NameColourId);
            return await query.FirstAsync();
        }

        public async Task<string> GetRandom()
        {
            var colours = await GetAll();
            return colours[new Random().Next(0, colours.Count)].ColourHex;
        }
    }
}

