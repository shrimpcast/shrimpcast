using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IBingoRepository
    {
        Task<BingoOption> AddOption(string Content);

        Task<List<BingoOption>> GetAllOptions();

        Task<bool> ToggleOptionStatus(int BingoOptionId);

        Task<bool> RemoveOption(int BingoOptionId);

        Task<BingoOption?> ExistsById(int Id);

        Task<bool> IsBingo();
    }
}

