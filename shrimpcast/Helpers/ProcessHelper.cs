﻿using System.Diagnostics;

namespace shrimpcast.Helpers
{
    public class ProcessHelper
    {
        public static async Task<string> StartProcess(string FileName, string Arguments, string SuccessMessage, bool ReturnOutput)
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
            
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            
            await process.WaitForExitAsync();

            if (process.ExitCode == 0) return ReturnOutput ? await outputTask : SuccessMessage;
            else return $"Error output: {await errorTask}";
        }

        public static async Task<string> DockerRestart() =>
            await StartProcess("sudo", "systemctl restart docker", "Docker restarted successfully", false);
    }
}
