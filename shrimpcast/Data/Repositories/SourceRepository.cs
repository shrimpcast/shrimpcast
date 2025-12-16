using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;

namespace shrimpcast.Data.Repositories
{
    public class SourceRepository : ISourceRepository
    {
        private readonly APPContext _context;
        private readonly ConfigurationSingleton _configurationSingleton;

        public SourceRepository(APPContext context, ConfigurationSingleton configurationSingleton)
        {
            _context = context;
            _configurationSingleton = configurationSingleton;
        }

        public async Task<List<Source>> GetAll() =>
            await _context.Sources.AsNoTracking()
            .OrderBy(s => s.SortPriority)
            .ThenBy(s => s.CreatedAt)
            .ToListAsync();

        public async Task<bool> Save(List<Source> newSources)
        {
            var existingSources = _configurationSingleton.Configuration.Sources;
            var model = Source.GetModel(true);

            // CUD
            foreach (var newSource in newSources) 
            {
                // Create
                var existingSource = existingSources.FirstOrDefault(es => es.Name == newSource.Name);
                if (existingSource == null) 
                {
                    if (!Constants.SOURCE_RESERVERD_WORDS.Contains(newSource.Name.ToLower()))
                    {
                        ValidateSourceWeights(newSource.Url);
                        await _context.AddAsync(newSource);
                    }
                } 
                // Update
                else if (JsonConvert.SerializeObject(newSource) != JsonConvert.SerializeObject(existingSource))
                {
                    var entity = await _context.Sources.FirstAsync(s => s.Name == existingSource.Name);
                    var existingType = entity.GetType();
                    var newType  = newSource.GetType();
                    foreach (var field in model)
                    {
                        var newValue = newType.GetProperty(field.Key)!.GetValue(newSource);
                        if (field.Key == nameof(Source.Url)) ValidateSourceWeights(newValue!.ToString());
                        existingType.GetProperty(field.Key)!.SetValue(entity, newValue);
                    }
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

        private void ValidateSourceWeights(string? input)
        {
            if (string.IsNullOrEmpty(input) || !input.StartsWith("[lbs]")) return;

            var url = input.Split("[/lbs]");
            var lbs = url[0].Replace("[lbs]", "");

            if (lbs.StartsWith("w"))
            {
                lbs = lbs.Replace("w", "");
                var weights = lbs.Split(",").Select(int.Parse);
                var sum = weights.Sum();
                if (sum != 100) throw new InvalidDataException();
            }

            if (lbs.StartsWith("ei"))
            {
                lbs = lbs.Replace("ei", "");
                var values = lbs.Split("_");
                var max = ushort.Parse(values[0]);
                if (max == 1 && values[1] == "1") throw new InvalidDataException();
                var instances = values[1].Split(",").Select(ushort.Parse).Distinct();
                var containedValues = 0;
                for (ushort i = 1; i <= max; i++)
                {
                    if (instances.Contains(i)) containedValues++;
                }
                if (containedValues == max) throw new InvalidDataException();
            }
        }
    }
}

