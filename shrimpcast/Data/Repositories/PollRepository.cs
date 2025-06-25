using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class PollRepository : IPollRepository
    {
        private readonly APPContext _context;

        public PollRepository(APPContext context)
        {
            _context = context;
        }

        public async Task<List<dynamic>> GetOptionVotes(int PollOptionId)
        {
            var votes = from pvotes in _context.PollVotes
                        join poptions in _context.PollOptions on pvotes.PollOptionId equals poptions.PollOptionId
                        where pvotes.PollOptionId == PollOptionId && poptions.IsActive
                        select new
                        {
                            pvotes.SessionId,
                            // RemoteAddress must always be removed before being sent to the response
                            // Only used to determine if the user is connected or not
                            pvotes.RemoteAddress,
                            SessionName = (from sn in _context.SessionNames where sn.SessionId == pvotes.SessionId orderby sn.CreatedAt select sn.Name).Last(),
                        };
            var result = await votes.AsNoTracking().ToListAsync();
            return result.Cast<object>().ToList();
        }

        public async Task<List<PollOption>> GetOptions(int PollId)
        {
            var options = (from poptions in _context.PollOptions
                           where poptions.IsActive
                           select new PollOption
                           {
                             CreatedAt = poptions.CreatedAt,
                             Value = poptions.Value,
                             IsActive = poptions.IsActive,
                             PollId = poptions.PollId,
                             PollOptionId = poptions.PollOptionId,
                             SessionId = poptions.SessionId,
                             VoteCount = (from pvotes in _context.PollVotes where pvotes.PollOptionId == poptions.PollOptionId select pvotes.PollVoteId).Count(),
                           });
            return await options.ToListAsync();
        }

        public async Task<Poll> GetExistingOrNew(bool SkipOptions)
        {
            var Poll = await _context.Polls.FirstOrDefaultAsync();
            if (Poll != null)
            {
                if (!SkipOptions)
                {
                    Poll.Options = await GetOptions(Poll.PollId);
                }
                return Poll;
            } 

            Poll = new Poll
            {
                CreatedAt = DateTime.UtcNow,
            };
            await _context.AddAsync(Poll);
            await _context.SaveChangesAsync();
            return Poll;
        }


        public async Task<PollOption> AddOption(int SessionId, string Option)
        {
            var Poll = await GetExistingOrNew(true);
            var PollOption = new PollOption
            {
                CreatedAt = DateTime.UtcNow,
                Value = Option,
                PollId = Poll.PollId,
                IsActive = true,
                SessionId = SessionId,
            };

            var exists = await _context.PollOptions.FirstOrDefaultAsync(po => po.IsActive && po.Value == Option);
            if (exists != null) throw new Exception("Option already exists.");

            await _context.AddAsync(PollOption);
            await _context.SaveChangesAsync();
            return PollOption;
        }

        public async Task<PollVote?> CanAddVote(string RemoteAddress, int SessionId)
        {
            var query = (from pvotes in _context.PollVotes
                         join poptions in _context.PollOptions on pvotes.PollOptionId equals poptions.PollOptionId
                         where poptions.IsActive && (pvotes.RemoteAddress == RemoteAddress || pvotes.SessionId == SessionId)
                         select pvotes).Take(1);
            var userVoted = await query.FirstOrDefaultAsync();
            return userVoted;
        }

        public async Task<bool> AddVote(int PollOptionId, int SessionId, string RemoteAddress)
        {
            var vote = new PollVote
            {
                CreatedAt = DateTime.UtcNow,
                PollOptionId = PollOptionId,
                SessionId = SessionId,
                RemoteAddress = RemoteAddress,
            };

            await _context.AddAsync(vote);
            var result = await _context.SaveChangesAsync();
            return result > 0 ? true : throw new Exception("Could not add record.");
        }

        public async Task<bool> UpdateVote(int PollVoteId, int PollOptionId, int SessionId, string RemoteAddress)
        {
            var vote = await _context.PollVotes.Where(pv => pv.PollVoteId == PollVoteId).FirstAsync();
            if (vote.PollOptionId ==  PollOptionId)
            {
                _context.PollVotes.Remove(vote);
            }
            else
            {
                vote.PollOptionId = PollOptionId;
            }

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> RemovePollOption(int PollOptionId, bool RemoveAll)
        {
            var result = 0;
            if (!RemoveAll)
            {
                var pollOption = await _context.PollOptions.FirstAsync(po => po.PollOptionId == PollOptionId);
                pollOption.IsActive = false;
                result = await _context.SaveChangesAsync();
            }
            else
            {
                var Poll = await GetExistingOrNew(true);
                var query = _context.PollOptions.Where(po => po.PollId == Poll.PollId && po.IsActive);
                result = await query.ExecuteUpdateAsync(po => po.SetProperty(p => p.IsActive, p => false));
            }
            return result > 0 ? true : throw new Exception("Could not update record.");
        }

        public async Task<bool> IsOptionEnabled(int PollOptionId)
        {
            var option = await _context.PollOptions.AsNoTracking().FirstAsync(p => p.PollOptionId == PollOptionId);
            return option.IsActive;
        }
    }
}

