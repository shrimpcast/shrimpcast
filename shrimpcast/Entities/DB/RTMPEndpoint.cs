using System.ComponentModel.DataAnnotations.Schema;

namespace shrimpcast.Entities.DB
{
    public class RTMPEndpoint
    {
        public int RTMPEndpointId { get; set; }

        public required string Name { get; set; }
        
        public required string PublishKey { get; set; }

        [NotMapped]
        public string? IngressUrl { get; set; }

        [NotMapped]
        public string? IngressUrlAuth { get; set; }

        [NotMapped]
        public string? EgressUrl { get; set; }
    }
}
