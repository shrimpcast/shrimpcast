using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IPollRepository
    {
        Task<List<PollOption>> GetOptions(int PollId);
        Task<List<dynamic>> GetOptionVotes(int PollOptionId);
        Task<Poll> GetExistingOrNew(bool SkipOptions);
        Task<PollOption> AddOption(int SessionId, string Option);
        Task<PollVote?> CanAddVote(string RemoteAddress, int SessionId);
        Task<bool> AddVote(int PollOptionId, int SessionId, string RemoteAddress);
        Task<bool> UpdateVote(int PollVoteId, int PollOptionId, int SessionId, string RemoteAddress);
        Task<bool> RemovePollOption(int PollOptionId, bool RemoveAll);
        Task<bool> IsOptionEnabled(int PollOptionId);
    }
}

