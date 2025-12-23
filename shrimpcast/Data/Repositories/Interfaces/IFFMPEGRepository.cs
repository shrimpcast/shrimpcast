using shrimpcast.Entities.DB;
using System.Diagnostics;
using System.Text.Json.Nodes;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IFFMPEGRepository
    {
        Task InitStreamProcesses();
        void InitStreamProcess(MediaServerStream stream, string StartedBy);
        Task<bool> StopStreamProcess(string stream, string reason);
        Task<string> LaunchProcess(string FileName, string Arguments, string SuccessMessage = "", bool ReturnOutput = true);
        Task<JsonNode?> Probe(string? Headers, string URL);
        string GetStreamDirectory(string Name);
        bool IsDevelopment();
        Task DoBackgroundTasks();
        bool HasExited(Process process);
        Process[] GetActiveFFMPEGProcesses();
        void KillAllProcesses();
        Task SendInstanceMetrics();
        void RemoveStaleViewers();
    }
}
