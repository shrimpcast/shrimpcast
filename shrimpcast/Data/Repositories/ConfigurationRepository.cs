using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly APPContext _context;

        public ConfigurationRepository(APPContext context)
        {
            _context = context;
        }

        public async Task<Configuration> GetConfigurationAsync()=>
            await _context.Configurations.AsNoTracking().FirstAsync();

        public async Task<bool> SaveAsync(Configuration configuration)
        {
            var config = await _context.Configurations.FirstAsync();
            configuration.ConfigurationId = config.ConfigurationId;
            configuration.OBSPassword = configuration.OBSPasswordtNotMapped;
            configuration.OBSHost = configuration.OBSHostNotMapped;
            configuration.VAPIDPrivateKey = configuration.VAPIDPrivateKeyNotMapped;
            configuration.VAPIDMail = configuration.VAPIDMailNotMapped;
            configuration.IPServiceApiKey = configuration.IPServiceApiKeyNotMapped;
            configuration.BTCServerApiKey = configuration.BTCServerApiKeyNotMapped;
            configuration.BTCServerWebhookSecret = configuration.BTCServerWebhookSecretNotMapped;
            if (configuration.MaxConnectionsPerIP < 1) configuration.MaxConnectionsPerIP = 1;
            _context.Entry(config).CurrentValues.SetValues(configuration);
            var updated = await _context.SaveChangesAsync();
            configuration.OBSHostNotMapped = null;
            configuration.OBSPasswordtNotMapped = null;
            configuration.VAPIDPrivateKeyNotMapped = null;
            configuration.VAPIDMailNotMapped = null;
            configuration.IPServiceApiKeyNotMapped = null;
            configuration.BTCServerApiKeyNotMapped = null;
            configuration.BTCServerWebhookSecretNotMapped = null;
            return updated > 0;
        }
    }
}

