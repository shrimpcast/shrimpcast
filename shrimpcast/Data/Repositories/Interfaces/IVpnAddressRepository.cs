namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IVpnAddressRepository
    {
        Task<bool> IsVpnAddress(string RemoteAddress);
    }
}
