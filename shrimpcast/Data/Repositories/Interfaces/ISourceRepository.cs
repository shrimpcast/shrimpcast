using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface ISourceRepository
    {
        Task<List<Source>> GetAll();
        Task<bool> Save(List<Source> sources);
        Task<bool> ChangeSourceStatus(string sourceName, bool status);
    }
}

