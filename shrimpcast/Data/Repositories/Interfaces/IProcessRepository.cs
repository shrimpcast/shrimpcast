using shrimpcast.Entities;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IProcessRepository
    {
        Task InitStreamProcesses();
        void InitStreamProcess(MediaServerStream stream);
        Task<bool> StopStreamProcess(string stream);
        Task<string> ExecSingleInstanceProcess(string FileName, string Arguments, string SuccessMessage = "", bool ReturnOutput = true);
    }
}
