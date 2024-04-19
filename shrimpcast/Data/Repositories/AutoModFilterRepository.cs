using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class AutoModFilterRepository(APPContext context) : IAutoModFilterRepository
    {
        private readonly APPContext _context = context;

        public async Task<bool> Add(string Content)
        {
            if (_context.AutoModFilters.FirstOrDefault(filter => filter.Content == Content) != null) return true;
            await _context.AddAsync(new AutoModFilter
            {
                Content = Content
            });
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not add filter.");
        }

        public async Task<List<AutoModFilter>> GetAll()
        {
            var query = _context.AutoModFilters.AsNoTracking();
            return await query.ToListAsync();
        }

        public async Task<bool> Remove(int AutoModFilterId)
        {
            var filter = await _context.AutoModFilters.Where(filter => filter.AutoModFilterId == AutoModFilterId).FirstAsync();
            _context.AutoModFilters.Remove(filter);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Contains(string Content)
        {
            return await _context.AutoModFilters.AsNoTracking().AnyAsync(filter => Content.Contains(filter.Content));
        }
    }
}

