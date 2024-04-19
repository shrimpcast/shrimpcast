using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DB;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class MessageController(IMessageRepository messageRepository) : ControllerBase
    {
        private readonly IMessageRepository _messageRepository = messageRepository;

        [HttpGet, Route("[action]")]
        public async Task<List<Message>> GetExisting() =>
            await _messageRepository.GetExisting();
    }
}
