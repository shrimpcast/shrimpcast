using shrimpcast.Data.Repositories.Interfaces;
using shrimpcast.Entities;
using shrimpcast.Entities.DB;
using System.Diagnostics;
using System.IO;

namespace shrimpcast.Helpers
{
    public class FFMPEGHelper
    {
        public static (string, string) BuildProbeCommand (string? Headers, string URL)
        {
            var baseProcess = "ffprobe";
            var command = $"-v quiet -print_format json -show_format -show_streams";

            if (!string.IsNullOrEmpty(Headers)) command += $" -headers \"{Headers}\"";
            command += $" -i {URL}";

            return (baseProcess, command); 
        }

        public static StreamInfo BuildStreamCommand(MediaServerStream stream)
        {
            var baseProcess = "ffmpeg";
            var command = "-re";

            if (!string.IsNullOrEmpty(stream.CustomHeaders)) command += $" -headers \"{stream.CustomHeaders}\"";

            command+= $" -i \"{stream.IngressUri}\"";
            

            if (stream.VideoEncodingPreset == "PASSTHROUGH") command += " -c copy";
            if (stream.LowLatency) command += " -flags +low_delay";

            var dirInfo = Directory.CreateDirectory(GetStreamDir(stream.Name));
            command += $" -f hls -hls_time {stream.SegmentLength} -hls_list_size {stream.ListSize} -hls_flags delete_segments+append_list+program_date_time -hls_segment_filename \"{dirInfo.FullName}\\live_%03d.ts\" {dirInfo.FullName}\\index.m3u8";


            return new StreamInfo
            {
                LaunchCommand = $"{baseProcess} {command}",
                StreamPath = GetStreamPath(stream.Name.ToLower()),
                Stream = stream,
                Process = ProcessRepository.MakeProcess(baseProcess, command, true)
            };
        }

        public static void KillAllProcesses()
        {
            CleanStreamDir(CleanRoot: true);
            foreach (var process in Process.GetProcessesByName("ffmpeg")) process.Kill();
        }

        private static string GetStreamPath(string stream)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            return environment == "Development" ? $"/api/mediaserver/stream/{stream}/index.m3u8"
                                                : $"/streams/{stream}/index.m3u8";
        }

        private static string GetBaseDir()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            return environment == "Development" ? Path.Combine(Directory.GetCurrentDirectory(), "streams")
                                                : "wwwroot\\streams";
        }
            
        public static string GetStreamDir(string Name) =>
            $"{GetBaseDir()}\\{Name.ToLower()}";

        public static void CleanStreamDir (string Name = "", bool CleanRoot = false)
        {
            try
            {
                var dir = CleanRoot ? GetBaseDir() : GetStreamDir(Name);
                Directory.Delete(dir, true);
            } catch (Exception) { }
        }
    }
}