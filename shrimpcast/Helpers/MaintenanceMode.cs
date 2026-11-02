namespace shrimpcast.Helpers
{
    public class MaintenanceMode
    {
        private readonly static bool IsWindows = OperatingSystem.IsWindows();

        private readonly static string FlagPath = IsWindows ?
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "shrimpcast")
            : "/root";

        private readonly static string FlagFile = "maintenance.flag";

        public static bool IsUnderMaintenance()
        {
            var filePath = Path.Combine(FlagPath, FlagFile);
            return File.Exists(filePath);
        }
    }
}
