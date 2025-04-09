namespace shrimpcast.Entities.DTO
{
    public class InvoiceDTO
    {
        public required string Status { get; set; }

        public required string CheckoutLink { get; set; }

        public required long CreatedTime { get; set; }  

        public bool IsStripe { get; set; }  
    }
}
