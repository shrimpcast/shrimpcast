using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class AutoModFilterRepository(APPContext context) : IAutoModFilterRepository
    {
        private readonly APPContext _context = context;

        public async Task<AutoModFilter?> Add(string Content, bool IgnoreCase, bool IgnoreDiacritic)
        {
            if (_context.AutoModFilters.AsNoTracking().FirstOrDefault(filter => filter.Content == Content) != null) return null;
            var filter = new AutoModFilter
            {
                Content = Content,
                IgnoreCase = IgnoreCase,
                IgnoreDiacritic = IgnoreDiacritic,
            };
            await _context.AddAsync(filter);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? filter : throw new Exception("Could not add filter.");
        }

        public async Task<List<AutoModFilter>> GetAll()
        {
            var query = _context.AutoModFilters.AsNoTracking();
            return await query.ToListAsync();
        }

        public async Task<bool> Edit(AutoModFilter filter)
        {
            var autoModFilter = await _context.AutoModFilters.FirstAsync(f => f.AutoModFilterId == filter.AutoModFilterId);
            _context.Entry(autoModFilter).CurrentValues.SetValues(filter);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Remove(int AutoModFilterId)
        {
            var filter = await _context.AutoModFilters.Where(filter => filter.AutoModFilterId == AutoModFilterId).FirstAsync();
            _context.AutoModFilters.Remove(filter);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Contains(string Content)
        {
            var query = _context.AutoModFilters
                                .AsNoTracking()
                                .AnyAsync(f =>
                                 // Ignore case only
                                 (f.IgnoreCase && !f.IgnoreDiacritic && Content.ToLower().Contains(f.Content.ToLower()))
                                 ||
                                 // Ignore accents only
                                 (!f.IgnoreCase && f.IgnoreDiacritic && EF.Functions.Unaccent(Content).Contains(EF.Functions.Unaccent(f.Content)))
                                 ||
                                 // Ignore both case and accents
                                 (f.IgnoreCase && f.IgnoreDiacritic && EF.Functions.Unaccent(Content.ToLower()).Contains(EF.Functions.Unaccent(f.Content.ToLower())))
                                 ||
                                 // Neither
                                 (!f.IgnoreCase && !f.IgnoreDiacritic && Content.Contains(f.Content))
                                );
            return await query;
        }
    }
}

