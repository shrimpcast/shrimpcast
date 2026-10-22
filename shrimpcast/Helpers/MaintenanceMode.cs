using Hardware.Info;

namespace shrimpcast.Helpers
{
    public class MaintenanceMode
    {
        private readonly static bool IsWindows = OperatingSystem.IsWindows();

        private readonly static string FlagPath = IsWindows ?
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "shrimpcast") 
            : "/var/lib/shrimpcast";

        private readonly static string FlagFile = "maintenance.flag";

        public static bool IsUnderMaintenance()
        {
            var directory = Directory.CreateDirectory(FlagPath);
            var filePath = Path.Combine(directory.FullName, FlagFile);
            return File.Exists(filePath);
        }
    }
}
