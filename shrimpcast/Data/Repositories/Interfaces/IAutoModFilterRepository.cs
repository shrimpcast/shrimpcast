using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IAutoModFilterRepository
    {
        Task<AutoModFilter?> Add(string Content, bool IgnoreCase, bool IgnoreDiacritic);
        Task<List<AutoModFilter>> GetAll();
        Task<bool> Remove(int AutoModFilterId);
        Task<bool> Edit(AutoModFilter filter);
        Task<bool> Contains(string Content);
    }
}

