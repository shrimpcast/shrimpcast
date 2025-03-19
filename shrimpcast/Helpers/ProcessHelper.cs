using System.Diagnostics;

namespace shrimpcast.Helpers
{
    public class ProcessHelper
    {
        public static async Task<string> DockerRestart()
        {
            var psi = new ProcessStartInfo
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                FileName = "sudo",
                Arguments = "systemctl restart docker",
            };

            using var process = new Process { StartInfo = psi };
            process.Start();
            await process.WaitForExitAsync();

            if (process.ExitCode == 0) return "Docker restarted successfully";
            else
            {
                var error = await process.StandardError.ReadToEndAsync();
                return $"Error output: {error}";
            }
        }
    }
}
