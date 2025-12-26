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
        Task<JsonNode?> Probe(string? Headers, string URL);
        string GetStreamDirectory(string Name);
        Task DoBackgroundTasks();
        bool HasExited(Process process);
        Process[] GetActiveFFMPEGProcesses();
        void KillAllProcesses();
        Task SendInstanceMetrics();
        void RemoveStaleViewers();
    }
}
