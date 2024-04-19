using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IAutoModFilterRepository
    {
        Task<bool> Add(string Content);
        Task<List<AutoModFilter>> GetAll();
        Task<bool> Remove(int AutoModFilterId);
        Task<bool> Contains(string Content);
    }
}

