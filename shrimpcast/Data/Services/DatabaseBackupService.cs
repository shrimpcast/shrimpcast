using Hangfire;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Data.Services.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Helpers;
using System.IO.Compression;
using System.Net.Http.Headers;
using System.Text.Json;
using File = System.IO.File;

namespace shrimpcast.Data.Services
{
    public class DatabaseBackupService(IFFMPEGRepository fFMPEGRepository, ConfigurationSingleton configurationSingleton) : IDatabaseBackupService
    {
        private readonly IFFMPEGRepository _fFMPEGRepository = fFMPEGRepository;
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        private static bool Initialized = false;
        private static HttpClient? _httpClient;

        public void Initialize()
        {
            if (Initialized) throw new Exception("Initialize() can only be called once per runtime");
            RecurringJob.AddOrUpdate("database-backup", () => CreateAndUploadDatabaseBackup(), "*/10 * * * *");
            InitializeHttpClient();
            _fFMPEGRepository.MediaServerLog("Initialized database backup service");
            Initialized = true;
        }

        private static void InitializeHttpClient()
        {
            _httpClient = new HttpClient { Timeout = TimeSpan.FromMinutes(5) };
            _httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("shrimpcast", Constants.BACKEND_VERSION));
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
        }

        public async Task CreateAndUploadDatabaseBackup()
        {
            var config = _configurationSingleton.Configuration;
            if (!config.EnableDatabaseBackup) return;

            var backupFile = string.Empty;

            try
            {
                _fFMPEGRepository.MediaServerLog($"Starting database backup...");
                _httpClient!.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", config.GithubToken);
                var apiUrl = $"https://api.github.com/repos/{config.GithubRepositoryName}";

                backupFile = await CreateDatabaseDump();
                var oldAssetIds = await GetAssetIdsAsync(apiUrl, config.GithubReleaseId.GetValueOrDefault());
                var backupUrl = await UploadAndVerifyAsync(backupFile,
                                                           config.GithubRepositoryName!,
                                                           config.GithubReleaseId.GetValueOrDefault());

                _fFMPEGRepository.MediaServerLog($"Successfully uploaded backup file: {backupUrl}");
                await DeleteOldAssets(apiUrl, oldAssetIds);
            }
            catch (Exception ex)
            {
                _fFMPEGRepository.MediaServerLog($"Job database-backup failed: {ex.Message}");
            }

            if (backupFile != string.Empty)
            {
                TryDelete(backupFile);
            }
        }

        private async Task<string> CreateDatabaseDump()
        {
            var baseName = $"backup-{DateTime.UtcNow:yyyyMMdd-HHmmss}";
            var sqlDumpFile = $"{baseName}.sql";
            TryDelete(sqlDumpFile);
            var processArguments = $"-h localhost -p 5432 -U postgres -d shrimpcast -f {sqlDumpFile}";
            var databaseDump = await ProcessLauncher.LaunchProcess("pg_dump",
                                                                   processArguments,
                                                                   "Success",
                                                                   false,
                                                                   null,
                                                                   new KeyValuePair<string, string>("PGPASSWORD", "$hrimpca$t"));

            if (databaseDump != "Success" || !File.Exists(sqlDumpFile))
            {
                throw new Exception("Could not create database dump");
            }

            var zipFile = $"{baseName}.zip";
            TryDelete(zipFile);
            using var zip = ZipFile.Open(zipFile, ZipArchiveMode.Create);
            zip.CreateEntryFromFile(sqlDumpFile, Path.GetFileName(sqlDumpFile));

            if (!File.Exists(zipFile))
            {
                throw new Exception("Could not create database dump");
            }

            TryDelete(sqlDumpFile);
            return zipFile;
        }

        private static async Task<List<long>> GetAssetIdsAsync(string apiUrl, long releaseId)
        {
            var ids = await GetStringAsync($"{apiUrl}/releases/{releaseId}/assets?per_page=100");
            using var doc = JsonDocument.Parse(ids);
            return [.. doc.RootElement
                .EnumerateArray()
                .Select(a => a.GetProperty("id").GetInt64())];
        }

        private async Task DeleteOldAssets(string apiUrl, List<long> oldAssetIds)
        {
            foreach (var id in oldAssetIds)
            {
                var deleteRequest = await _httpClient!.DeleteAsync($"{apiUrl}/releases/assets/{id}");
                if (!deleteRequest.IsSuccessStatusCode)
                {
                    _fFMPEGRepository.MediaServerLog($"Warning: failed to delete old asset {id} ({(int)deleteRequest.StatusCode}).");
                }
            }
        }

        private static async Task<string> UploadAndVerifyAsync(string backupFile, string repoName, long releaseId)
        {
            await using var fileStream = File.OpenRead(backupFile);
            using var content = new StreamContent(fileStream);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/zip");

            var url = $"https://uploads.github.com/repos/{repoName}/releases/{releaseId}/assets?name={Uri.EscapeDataString(backupFile)}";
            using var request = await _httpClient!.PostAsync(url, content);
            var responseBody = await request.Content.ReadAsStringAsync();

            if (!request.IsSuccessStatusCode)
            {
                throw new Exception($"Upload failed: {(int)request.StatusCode} {responseBody}.");
            }

            using var uploadedAsset = JsonDocument.Parse(responseBody);
            var state = uploadedAsset.RootElement.GetProperty("state").GetString();
            var size = uploadedAsset.RootElement.GetProperty("size").GetInt64();
            if (state != "uploaded")
            {
                throw new Exception($"Upload not verified (state={state}, size={size}).");
            }

            return uploadedAsset.RootElement.GetProperty("browser_download_url").GetString()!;
        }

        private void TryDelete(string filename)
        {
            try
            {
                if (File.Exists(filename))
                {
                    File.Delete(filename);
                }
            }
            catch (Exception ex)
            {
                _fFMPEGRepository.MediaServerLog($"Warning: could not delete {filename}: {ex.Message}");
            }
        }

        private static async Task<string> GetStringAsync(string url)
        {
            using var request = await _httpClient!.GetAsync(url);
            var responseBody = await request.Content.ReadAsStringAsync();
            if (!request.IsSuccessStatusCode)
            {
                throw new Exception($"GET {url} failed: {(int)request.StatusCode} {responseBody}");
            }
            return responseBody;
        }
    }
}
