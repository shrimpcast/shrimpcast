using Hardware.Info;

namespace shrimpcast.Helpers
{
    public class SystemStats
    {
        private readonly HardwareInfo _hardwareInfo;

        public SystemStats()
        {
            _hardwareInfo = new HardwareInfo();
        }

        private (float, uint) GetCpuUsage()
        {
            _hardwareInfo.RefreshCPUList();
            var cpu = _hardwareInfo.CpuList[0];
            return (cpu.PercentProcessorTime, cpu.NumberOfLogicalProcessors);
        }

        private float GetMemoryUsagePercentage()
        {
            _hardwareInfo.RefreshMemoryStatus();
            var memory = _hardwareInfo.MemoryStatus;
            var used = memory.TotalPhysical - memory.AvailablePhysical;
            return (float)(used * 100.0 / memory.TotalPhysical);
        }

        private double GetNetworkUsage()
        {
            _hardwareInfo.RefreshNetworkAdapterList();
            double totalUploadMbps = 0;

            foreach (var adapter in _hardwareInfo.NetworkAdapterList)
            {
                // Skip virtual adapters to avoid duplicates on linux
                if (adapter.Name.StartsWith("veth") || adapter.Name.StartsWith("lo")) continue;
                totalUploadMbps += adapter.BytesSentPersec * 8.0 / 1_000_000.0;
            }

            return totalUploadMbps;
        }

        private async Task<int> GetDiskUsage()
        {
            var usage = await ProcessLauncher.LaunchProcess("df", "--output=pcent /", "", true);
            usage = usage.Split("\n")[1].Replace("%", "");
            return int.Parse(usage);
        }

        public async Task<object> GetStats(int totalViewers = -1)
        {
            (var cpuUsage, var noCores) = GetCpuUsage();
            var memoryUsage = GetMemoryUsagePercentage();
            var networkUsage = GetNetworkUsage();
            var diskUsage = await GetDiskUsage();

            return new
            {
                cpu = new { numeric = cpuUsage, _string = $"{cpuUsage:F2}% - {noCores} core{(noCores > 1 ? "s" : null)}" },
                memory = new { numeric = memoryUsage, _string = $"{memoryUsage:F2}%" },
                network = new { numeric = networkUsage, _string = $"{networkUsage:F2}mbps" },
                disk = new { numeric = diskUsage, _string = $"{diskUsage}%" },
                totalViewers,
            };
        }
    }
}
