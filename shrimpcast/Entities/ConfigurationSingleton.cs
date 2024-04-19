using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Entities
{
    public class ConfigurationSingleton(IServiceScopeFactory serviceScopeFactory)
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private Configuration? _configuration;
        public Configuration Configuration
        {
            get
            {
                if (_configuration == null) throw new Exception("_configuration yielded null.");
                return _configuration;
            }
            set { _configuration = value; }
        }

        public async Task Initialize()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var configurationRepository = scope.ServiceProvider.GetRequiredService<IConfigurationRepository>();
            Configuration = await configurationRepository.GetConfigurationAsync();
        }
    }
}

