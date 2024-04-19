namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface ITorExitNodeRepository
    {
        Task<bool> IsTorExitNode(string RemoteAddress);
    }
}

