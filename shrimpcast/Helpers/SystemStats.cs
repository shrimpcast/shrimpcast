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
                if (adapter.Name.StartsWith("veth") || adapter.Name.StartsWith("lo"))
                    continue;

                totalUploadMbps += adapter.BytesSentPersec * 8.0 / 1_000_000.0;
            }

            return totalUploadMbps;
        }
    }
}
