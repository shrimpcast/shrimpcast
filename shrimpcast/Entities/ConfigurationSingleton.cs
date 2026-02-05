using Panlingo.LanguageIdentification.FastText;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Entities
{
    public class ConfigurationSingleton(IServiceScopeFactory serviceScopeFactory)
    {
        public int AppInitialized = 0;

        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private Configuration? _configuration;
        private FastTextDetector? _languageDetector;

        public Configuration Configuration
        {
            get
            {
                if (_configuration == null) throw new Exception("_configuration yielded null");
                return _configuration;
            }
            set { _configuration = value; }
        }


        public FastTextDetector LanguageDetector
        {
            get
            {
                if (_languageDetector == null) throw new Exception("An instance of FastTextDetector hasn't been initialized.");
                return _languageDetector;
            }
            set { _languageDetector = value; }
        }

        public async Task Initialize()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var configurationRepository = scope.ServiceProvider.GetRequiredService<IConfigurationRepository>();
            Configuration = await configurationRepository.GetConfigurationAsync();

            try
            {
                var fastTextDetector = new FastTextDetector();
                fastTextDetector.LoadDefaultModel();
                LanguageDetector = fastTextDetector;
            }
            catch (Exception ex)
            {
                var ffmpegRepository = scope.ServiceProvider.GetRequiredService<IFFMPEGRepository>();
                ffmpegRepository.MediaServerLog($"Could not initialize FastTextDetector: {ex}");
            }
        }
    }
}

