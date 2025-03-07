namespace shrimpcast.Data.Repositories.Interfaces
{
    public interface IVpnAddressRepository
    {
        Task<bool> IsVpnAddress(string RemoteAddress);
        Task<string> InvokeVerificationService(string RemoteAddress);
        Task<int> ResetRecords();
    }
}
