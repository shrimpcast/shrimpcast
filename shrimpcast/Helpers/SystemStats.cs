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

        public double GetDiskUsage()
        {
            _hardwareInfo.RefreshDriveList();
            var drive = _hardwareInfo.DriveList.First(d => d.PartitionList.Count > 0);
            double total = 0;
            double free = 0;

            foreach (var partition in drive.PartitionList)
            {
                if (partition.VolumeList.Count == 0) continue;

                foreach (var volume in partition.VolumeList)
                {
                    total += volume.Size;
                    free += volume.FreeSpace;
                }
            }

            double totalGB = total / (1024.0 * 1024.0 * 1024.0);
            double freeGB = free / (1024.0 * 1024.0 * 1024.0);
            double usedGB = totalGB - freeGB;
            return (usedGB * 100) / totalGB;
        }

        public object GetStats()
        {
            var cpuUsage = GetCpuUsage();
            var memoryUsage = GetMemoryUsagePercentage();
            var networkUsage = GetNetworkUsage();
            var diskUsage = GetDiskUsage();

            return new
            {
                cpu = new { numeric = cpuUsage, _string = $"{cpuUsage:F2}%" },
                memory = new { numeric = memoryUsage, _string = $"{memoryUsage:F2}%" },
                network = new { numeric = networkUsage, _string = $"{networkUsage:F2}mbps" },
                disk = new { numeric = diskUsage, _string = $"{diskUsage:F2}mbps" },
            };
        }
    }
}
