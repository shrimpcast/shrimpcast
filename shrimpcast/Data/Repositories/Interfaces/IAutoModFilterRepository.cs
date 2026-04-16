using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IAutoModFilterRepository
    {
        Task<AutoModFilter?> Add(AutoModFilter autoModFilter);
        Task<List<AutoModFilter>> GetAll();
        Task<bool> Remove(int AutoModFilterId);
        Task<bool> Edit(AutoModFilter filter);
        Task<bool> Contains(string Content, bool IsAutoBanType);
    }
}

