using Microsoft.AspNetCore.Components.Web;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class SourceRepostiory : ISourceRepository
    {
        private readonly APPContext _context;
        private readonly ConfigurationSingleton _configurationSingleton;

        public SourceRepostiory(APPContext context, ConfigurationSingleton configurationSingleton)
        {
            _context = context;
            _configurationSingleton = configurationSingleton;
        }

        public async Task<List<Source>> GetAll() =>
            await _context.Sources.AsNoTracking().OrderBy(s => s.CreatedAt).ToListAsync();

        public async Task<bool> Save(List<Source> newSources)
        {
            var existingSources = _configurationSingleton.Configuration.Sources;

            // Add & edit
            foreach (var newSource in newSources) 
            {
                // Add operation
                var existingSource = existingSources.FirstOrDefault(es => es.Name == newSource.Name);
                if (existingSource == null) await _context.AddAsync(newSource);
                // Edit operation
                else if (JsonConvert.SerializeObject(newSource) != JsonConvert.SerializeObject(existingSource))
                {
                    var entity = await _context.Sources.FirstAsync(s => s.Name == existingSource.Name);
                    entity.IsEnabled = newSource.IsEnabled;
                    entity.Name = newSource.Name;
                    entity.Title = newSource.Title;
                    entity.Url = newSource.Url;
                    entity.Thumbnail = newSource.Thumbnail;
                    entity.UseLegacyPlayer = newSource.UseLegacyPlayer;
                    entity.UseRTCEmbed = newSource.UseRTCEmbed;
                    entity.StartsAt = newSource.StartsAt;
                    entity.EndsAt = newSource.EndsAt;
                    entity.ResetOnScheduledSwitch = newSource.ResetOnScheduledSwitch;
                }
            }

            // Delete
            foreach (var existingSource in existingSources)
            {
                if (!newSources.Any(ns => existingSource.Name == ns.Name))
                {
                    var source = await _context.Sources.FirstAsync(ns => existingSource.Name == ns.Name);
                    _context.Sources.Remove(source);
                }
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangeSourceStatus(string sourceName, bool status)
        {
            var source = _context.Sources.First(s => s.Name == sourceName);
            source.IsEnabled = status;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ExistsByName(string sourceName) =>
            await _context.Sources.AsNoTracking().AnyAsync(s => s.Name == sourceName && s.IsEnabled);
    }
}

