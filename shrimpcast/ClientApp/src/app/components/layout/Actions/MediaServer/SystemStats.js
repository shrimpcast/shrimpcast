import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Stack } from "@mui/material";
import MediaServerManager from "../../../../managers/MediaServerManager";

const SystemStats = ({ signalR }) => {
  const defaultModel = {
      cpu: { numeric: 0, _string: "loading..." },
      memory: { numeric: 0, _string: "loading..." },
      network: { numeric: 0, _string: "loading..." },
    },
    [stats, setStats] = useState(defaultModel);

  useEffect(() => {
    const fetchStats = async (abortControllerSignal) => {
      const response = await MediaServerManager.GetSystemStats(abortControllerSignal);
      if (abortControllerSignal?.aborted) return;
      setStats(response || defaultModel);
      window.fetchStatsTimeout = setTimeout(fetchStats, 2500);
    };

    const abortController = new AbortController();
    fetchStats(abortController.signal);
    return () => {
      abortController.abort();
      clearTimeout(window.fetchStatsTimeout);
    };
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
