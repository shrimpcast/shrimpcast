using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IEmoteRepository
    {
       Task<object> GetAll();

       Task<object> Add(IFormFile emote, string name);

       Task<bool> Remove(int emoteId);

       Task<Emote> Get(string name);
    }
}

