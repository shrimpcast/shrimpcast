using System.Diagnostics;

namespace shrimpcast.Helpers
{
    public class ProcessHelper
    {
        private static async Task<string> StartProcess(string FileName, string Arguments, string SuccessMessage)
        {
            var psi = new ProcessStartInfo
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                FileName = FileName,
                Arguments = Arguments,
            };

            using var process = new Process { StartInfo = psi };
            process.Start();
            await process.WaitForExitAsync();

            if (process.ExitCode == 0) return SuccessMessage;
            else
            {
                var error = await process.StandardError.ReadToEndAsync();
                return $"Error output: {error}";
            }
        }

        public static async Task<string> DockerRestart() =>
            await StartProcess("sudo", "systemctl restart docker", "Docker restarted successfully");
    }
}
