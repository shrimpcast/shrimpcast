using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class BingoRepository : IBingoRepository
    {
        private readonly APPContext _context;

        public BingoRepository(APPContext context)
        {
            _context = context;
        }

        public async Task<BingoOption> AddOption(string Content)
        {
            var BingoOption = new BingoOption
            {
                CreatedAt = DateTime.UtcNow,
                Content = Content,
                IsChecked = false,
            };

            var exists = await _context.BingoOptions.AsNoTracking().FirstOrDefaultAsync(bo => bo.Content == Content);
            if (exists != null) throw new Exception("Option already exists.");

            await _context.AddAsync(BingoOption);
            await _context.SaveChangesAsync();
            return BingoOption;
        }

        public async Task<List<BingoOption>> GetAllOptions()
        {
            var options = await _context.BingoOptions.AsNoTracking().ToListAsync();
            return [.. options.OrderBy(o => o.CreatedAt)];
        }
            

        public async Task<bool> ToggleOptionStatus(int BingoOptionId)
        {
            var option = await GetById(BingoOptionId);
            option.IsChecked = !option.IsChecked;
            var result = await _context.SaveChangesAsync();
            return result > 0 ? option.IsChecked : throw new Exception("Could not add record.");
        }

        public async Task<bool> ResetBingo()
        {
            var result = await _context.BingoOptions.ExecuteUpdateAsync(bo => bo.SetProperty(p => p.IsChecked, p => false));
            return result > 0 ? true : throw new Exception("Could not reset bingo.");
        }

        public async Task<bool> RemoveOption(int BingoOptionId)
        {
            var option = await GetById(BingoOptionId);
            _context.BingoOptions.Remove(option);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<BingoOption?> ExistsById (int Id) => 
            await _context.BingoOptions.AsNoTracking().FirstOrDefaultAsync(bo => bo.BingoOptionId == Id);

        public async Task<bool> IsBingo() =>
            !await _context.BingoOptions.AsNoTracking().AnyAsync(bo => !bo.IsChecked);

        private async Task<BingoOption> GetById(int Id) =>
            await _context.BingoOptions.FirstAsync(bo => bo.BingoOptionId == Id);
    }
}

