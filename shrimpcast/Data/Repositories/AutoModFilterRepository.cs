using Microsoft.EntityFrameworkCore;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class AutoModFilterRepository(APPContext context) : IAutoModFilterRepository
    {
        private readonly APPContext _context = context;

        public async Task<AutoModFilter?> Add(AutoModFilter autoModFilter)
        {
            if (_context.AutoModFilters.AsNoTracking().FirstOrDefault(filter => filter.Content == autoModFilter.Content) != null) return null;
            await _context.AddAsync(autoModFilter);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? autoModFilter : throw new Exception("Could not add filter.");
        }

        public async Task<List<AutoModFilter>> GetAll() =>
            await _context.AutoModFilters.OrderBy(filter => filter.AutoModFilterId).ToListAsync();

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

        public async Task<bool> Contains(string Content, bool IsAutoBanType)
        {
            var query = _context.AutoModFilters
                                .AsNoTracking()
                                .AnyAsync(f =>
                                 f.AutoBan == IsAutoBanType && (
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
                                 )
                                );
            return await query;
        }
    }
}

