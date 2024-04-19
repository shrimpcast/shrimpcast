using Microsoft.EntityFrameworkCore;
using System.Net;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class TorExitNodeRepository(APPContext context) : ITorExitNodeRepository
    {
        private readonly APPContext _context = context;

        public async Task<bool> IsTorExitNode(string RemoteAddress)
        {
            var ConnectingIP = IPAddress.Parse(RemoteAddress);
            return await _context.TorExitNodes.AsNoTracking()
                                              .AnyAsync(node => IPAddress.Parse(node.RemoteAddress).Equals(ConnectingIP));
        }
    }
}

