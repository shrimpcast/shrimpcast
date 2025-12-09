using Hardware.Info;
using shrimpcast.Entities;

namespace shrimpcast.Helpers
{
    public class SystemStats
    {
        private readonly HardwareInfo _hardwareInfo;

        public SystemStats()
        {
            _hardwareInfo = new HardwareInfo();
        }

        public float GetCpuUsage()
        {
            _hardwareInfo.RefreshCPUList();
            return _hardwareInfo.CpuList[0].PercentProcessorTime;
        }

        public float GetMemoryUsagePercentage()
        {
            _hardwareInfo.RefreshMemoryStatus();
            var memory = _hardwareInfo.MemoryStatus;
            var used = memory.TotalPhysical - memory.AvailablePhysical;
            return (float)(used * 100.0 / memory.TotalPhysical);
        }

        public double GetNetworkUsage()
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

        public object GetStats()
        {
            var cpuUsage = GetCpuUsage();
            var memoryUsage = GetMemoryUsagePercentage();
            var networkUsage = GetNetworkUsage();

            return new
            {
                cpu = new { numeric = cpuUsage, _string = $"{cpuUsage:F2}%" },
                memory = new { numeric = memoryUsage, _string = $"{memoryUsage:F2}%" },
                network = new { numeric = networkUsage, _string = $"{networkUsage:F2}mbps" },
            };
        }
    }
}
