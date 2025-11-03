using Hardware.Info;
using System.Net.Sockets;
using System.Net;

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

            using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);
            socket.Connect("1.1.1.1", 53);

            var localEndPoint = (IPEndPoint)socket.LocalEndPoint!;
            var localIp = localEndPoint.Address;

            foreach (var adapter in _hardwareInfo.NetworkAdapterList)
            {
                foreach (var ip in adapter.IPAddressList)
                {
                    if (ip.Equals(localIp))
                    {
                        totalUploadMbps += adapter.BytesSentPersec * 8.0 / 1_000_000.0;
                    }
                }
            }

            return totalUploadMbps;
        }
    }
}
