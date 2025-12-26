using System.Diagnostics;

namespace shrimpcast.Helpers
{
    public class ProcessLauncher
    {
        public async static Task<string> LaunchProcess(string FileName, string Arguments, string SuccessMessage = "", bool ReturnOutput = true)
        {
            using var process = MakeProcess(FileName, Arguments, false);
            process.Start();

            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            if (process.ExitCode == 0) return ReturnOutput ? await outputTask : SuccessMessage;
            else return $"Error output: {await errorTask}";
        }

        public static Process MakeProcess(string FileName, string Arguments, bool RaisingEvents) =>
            new()
            {
                StartInfo = new ProcessStartInfo
                {
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    FileName = FileName,
                    Arguments = Arguments,
                },
                EnableRaisingEvents = RaisingEvents
            };
    }
}
