using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly APPContext _context;
        private readonly ISourceRepository _sourceRepository;

        public ConfigurationRepository(APPContext context, ISourceRepository sourceRepository)
        {
            _context = context;
            _sourceRepository = sourceRepository;
        }

        public async Task<Configuration> GetConfigurationAsync()
        {
            var config = await _context.Configurations.AsNoTracking().FirstAsync();
            config.Sources = await _sourceRepository.GetAll();
            return config;
        }

        public async Task<(bool updated, bool updatedSources)> SaveAsync(Configuration configuration)
        {
            var config = await _context.Configurations.FirstAsync();

            if (configuration.MaxConnectionsPerIP < 1) configuration.MaxConnectionsPerIP = 1;
            if (configuration.MaxMessagesToShow > 5500) configuration.MaxMessagesToShow = 5500;
            if (configuration.GoldenPassValue < 1) configuration.GoldenPassValue = 1;

            _context.Entry(config).CurrentValues.SetValues(configuration);
            var updated = await _context.SaveChangesAsync();

            var updatedSources = await _sourceRepository.Save(configuration.Sources);
            if (updatedSources) configuration.Sources = await _sourceRepository.GetAll();
            return updated > 0 || updatedSources ? (true, updatedSources) : throw new Exception("Could not update record.");
        }
    }
}

