using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface INameColourRepository
    {
        Task<List<NameColour>> GetAll();
        Task<NameColour> GetById(int NameColourId);
        Task<string> GetRandom();
    }
}

