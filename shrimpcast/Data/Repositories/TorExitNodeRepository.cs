using Microsoft.EntityFrameworkCore;
using shrimpcast.Data.Repositories.Interfaces;
using System.Net;

namespace shrimpcast.Data.Repositories
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

