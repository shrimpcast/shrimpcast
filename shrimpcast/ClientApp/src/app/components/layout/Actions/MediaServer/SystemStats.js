import { useEffect, useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";
import ResourceUsageWidget from "./ResourceUsageWidget";
import { Box } from "@mui/material";

const SystemStats = () => {
  const defaultModel = {
      system: {
        cpu: { numeric: 0, _string: "loading..." },
        memory: { numeric: 0, _string: "loading..." },
        network: { numeric: 0, _string: "loading..." },
        disk: { numeric: 0, _string: "loading..." },
      },
      instances: [],
    },
    [stats, setStats] = useState(defaultModel);

  useEffect(() => {
    const fetchStats = async (abortControllerSignal) => {
      const response = await MediaServerManager.GetSystemStats(abortControllerSignal);
      if (abortControllerSignal?.aborted) return;
      setStats(response || defaultModel);
      setTimeout(() => fetchStats(abortControllerSignal), 750);
    };

    const abortController = new AbortController();
    fetchStats(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box mt={1} p={1.5} borderRadius={2} bgcolor="background.paper" boxShadow={1} width="100%">
      <ResourceUsageWidget stats={stats.system} title="Resource usage - system" />
      {stats.instances.length ? (
        <>
          {stats.instances.map((instance) => (
            <ResourceUsageWidget
              stats={instance.stats.metrics}
              title={`${instance.stats.remoteAddress} - ${instance.stats.instanceName}`}
              instanceKey={`${instance.stats.remoteAddress}-${instance.stats.instanceName}`}
              key={instance.stats.remoteAddress}
              status={instance.isHealthy}
              mt={true}
            />
          ))}
        </>
      ) : null}
    </Box>
  );
};

export default SystemStats;
