import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Stack } from "@mui/material";
import MediaServerManager from "../../../../managers/MediaServerManager";

const SystemStats = ({ signalR }) => {
  const [stats, setStats] = useState({
    cpu: { numeric: 0, _string: "-" },
    memory: { numeric: 0, _string: "-" },
    network: { numeric: 0, _string: "-" },
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await MediaServerManager.GetSystemStats(signalR);
      setStats(response);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box mt={1} p={1.5} borderRadius={2} bgcolor="background.paper" boxShadow={1}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        System stats
      </Typography>

      <Stack spacing={1.2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            CPU: {stats.cpu._string}
          </Typography>
          <LinearProgress variant="determinate" value={stats.cpu.numeric} sx={{ height: 6, borderRadius: 3 }} />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Memory: {stats.memory._string}
          </Typography>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={stats.memory.numeric}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Network usage: {stats.network._string}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default SystemStats;
