using Microsoft.AspNetCore.Mvc;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities.DTO;

namespace shrimpcast.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class EmoteController(IEmoteRepository emoteRepository, ISessionRepository sessionRepository) : ControllerBase
    {
        private readonly IEmoteRepository _emoteRepository = emoteRepository;
        private readonly ISessionRepository _sessionRepository = sessionRepository;

        [HttpPost, Route("Add")]
        public async Task<object?> Add([FromForm] AddEmoteDTO emoteDTO)
        {
            var session = await _sessionRepository.GetExistingByTokenAsync(emoteDTO.AccessToken);
            if (session == null || !session.IsAdmin) throw new Exception("Permission denied.");
            var result = await _emoteRepository.Add(emoteDTO.Emote, emoteDTO.Name.ToLower());
            return result;
        }

        [HttpGet, Route("Get/{Name}")]
        [ResponseCache(Duration = 36000)]
        public async Task<FileContentResult> Get(string Name)
        {
            var emote = await _emoteRepository.Get(Name);
            return File(emote.Content, emote.ContentType);
        }
    }
}
