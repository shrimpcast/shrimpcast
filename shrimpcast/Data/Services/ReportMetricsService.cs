using Hangfire;
using Newtonsoft.Json;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Helpers;
using shrimpcast.Hubs;
using shrimpcast.Hubs.Dictionaries;
using System.Text;

namespace shrimpcast.Data.Services.Interfaces
{
    public class ReportMetricsService(IFFMPEGRepository fFMPEGRepository, ConfigurationSingleton configurationSingleton, Processes<SiteHub> processes, LBMetrics<SiteHub> lbMetrics) : IReportMetricsService
    {
        private readonly IFFMPEGRepository _fFMPEGRepository = fFMPEGRepository;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        private readonly Processes<SiteHub> _processes = processes;
        private readonly LBMetrics<SiteHub> _lbMetrics = lbMetrics;
        private static bool Initialized = false;

        public void Initialize()
        {
            if (Initialized) throw new Exception("Initialize() can only be called once per runtime");
            RecurringJob.AddOrUpdate("send-instance-metrics", () => SendInstanceMetrics(), Constants.SECONDS_TO_CRON(3));
            RecurringJob.AddOrUpdate("report-self-metrics", () => ReportSelfMetrics(), Constants.SECONDS_TO_CRON(3));
            _fFMPEGRepository.MediaServerLog("Initialized metric reports");
            Initialized = true;
        }

        [DisableConcurrentExecution(timeoutInSeconds: 3)]
        public async Task ReportSelfMetrics()
        {
            try
            {
                var totalViewerCount = _processes.All.Values.Sum(p => p.Viewers.Count);
                var metrics = new LBMetric
                {
                    InstanceName = "Resource usage - system",
                    Metrics = await new SystemStats().GetStats(totalViewerCount),
                };

                _lbMetrics.All.AddOrUpdate(metrics.InstanceName, metrics, (k, oldValue) => metrics);
            }
            catch (Exception ex)
            {
                _fFMPEGRepository.MediaServerLog($"Job report-self-metrics failed: {ex.Message}");
            }
        }

        [DisableConcurrentExecution(timeoutInSeconds: 10)]
        public async Task SendInstanceMetrics()
        {
            if (!_configurationSingleton.Configuration.LbSendInstanceMetrics) return;

            try
            {
                var config = _configurationSingleton.Configuration;
                var url = $"https://{config.LbTargetDomain}/api/mediaserver/SendInstanceMetrics";
                var systemStats = new SystemStats();
                var totalViewerCount = _processes.All.Values.Sum(p => p.Viewers.Count);

                var metrics = new LBMetric
                {
                    InstanceName = config.StreamTitle,
                    Metrics = await systemStats.GetStats(totalViewerCount),
                };

                var handler = Constants.IsDevelopment() ? new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                } : new HttpClientHandler();

                using var client = new HttpClient(handler)
                {
                    Timeout = TimeSpan.FromSeconds(3)
                };

                client.DefaultRequestHeaders.Add("User-Agent", $"shrimpcast/{Constants.BACKEND_VERSION}");
                client.DefaultRequestHeaders.Add("Auth-Token", config.LbAuthToken);
                var content = new StringContent(JsonConvert.SerializeObject(metrics), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _fFMPEGRepository.MediaServerLog($"Job send-instance-metrics failed: {ex.Message}");
            }
        }
    }
}
