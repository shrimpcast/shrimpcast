using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IRTMPEndpointRepository
    {
        Task<RTMPEndpoint?> Add(RTMPEndpoint mediaServerStream);
        Task<List<RTMPEndpoint>> GetAll();
        Task<RTMPEndpoint?> GetByName(string Name);
        Task<bool> Remove(int RTMPEndpointId);
        Task<bool> Edit(RTMPEndpoint mediaServerStream);
    }
}