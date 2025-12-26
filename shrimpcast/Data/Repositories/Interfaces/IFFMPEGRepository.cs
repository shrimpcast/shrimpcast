using shrimpcast.Entities.DB;
using System.Diagnostics;
using System.Text.Json.Nodes;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IFFMPEGRepository
    {
        Task Initialize();
        void MediaServerLog(string logContent);
        Task InitStreamProcesses();
        void InitStreamProcess(MediaServerStream stream, string StartedBy);
        Task<bool> StopStreamProcess(string stream, string reason);
        Task<JsonNode?> Probe(string? Headers, string URL);
        string GetStreamDirectory(string Name);
        bool HasExited(Process process);
        Process[] GetActiveFFMPEGProcesses();
        void KillAllProcesses();
    }
}
