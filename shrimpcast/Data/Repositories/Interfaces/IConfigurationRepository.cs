using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IConfigurationRepository
    {
        Task<Configuration> GetConfigurationAsync();
        Task<(bool updated, bool updatedSources)> SaveAsync(Configuration configuration);
    }
}

