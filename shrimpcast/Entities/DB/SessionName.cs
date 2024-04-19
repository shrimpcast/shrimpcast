using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace shrimpcast.Entities.DB
{
    [Index(nameof(CreatedAt), IsDescending = [true])]
    public class SessionName
    {
        public int SessionNameId { get; set; }

        public required int SessionId { get; set; }

        [MaxLength(32)]
        public required string Name { get; set; }

        public required DateTime CreatedAt { get; set; }
    }
}

