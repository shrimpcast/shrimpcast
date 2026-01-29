using System.Diagnostics;
using System.Text.Json.Nodes;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IFFMPEGRepository
    {
        void Initialize();
        void MediaServerLog(string logContent);
        Task<JsonNode?> ProbeStreamProcess(string? Headers, string URL, bool ForceHLS);
        void StopStreamProcess(string stream, string reason);
        string GetStreamDirectory(string Name);
        bool HasExited(Process process);
        Process[] GetActiveFFMPEGProcesses();
    }
}
