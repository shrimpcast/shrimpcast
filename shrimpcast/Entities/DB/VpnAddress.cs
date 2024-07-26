using Microsoft.EntityFrameworkCore;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(RemoteAddress), IsUnique = true)]
    public class VpnAddress
    {
        public int VpnAddressId { get; set; }
     
        public required bool IsVPN { get; set; }

        public required string RemoteAddress { get; set; }
    }
}

