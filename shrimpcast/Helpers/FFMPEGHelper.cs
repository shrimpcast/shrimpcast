using System.Text.Json.Nodes;

namespace shrimpcast.Helpers
{
    public class FFMPEGHelper
    {
        public FFMPEGHelper()
        {
        }

        public static async Task<JsonNode?> FFProbe (string? Headers, string URL)
        {
            var command = $"-v quiet -print_format json -show_format -show_streams {(!string.IsNullOrEmpty(Headers) ? $"-headers \"{Headers}\"" : "")} -i {URL}";
            try
            {
                var probe = await ProcessHelper.StartProcess("ffprobe", command, null!, true);
                return JsonNode.Parse(probe);
            }
            catch (Exception)
            {
                return $"Error: Probe failed (ffprobe {command})";
            }
        }
    }
}