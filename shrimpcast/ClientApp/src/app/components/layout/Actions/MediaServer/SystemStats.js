import { useEffect, useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";
import ResourceUsageWidget from "./ResourceUsageWidget";
import { Box, CircularProgress } from "@mui/material";

const BoxSx = {
    mt: 1,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "background.paper",
    boxShadow: 1,
    width: "100%",
    minHeight: "185px",
  },
  LoaderSx = {
    width: "40px",
    ml: "auto",
    mr: "auto",
    mt: 8,
  };

const SystemStats = () => {
  const defaultModel = {
      selfInstanceName: null,
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
    <Box sx={BoxSx}>
      {!stats.selfInstanceName ? (
        <Box sx={LoaderSx}>
          <CircularProgress color="secondary" />
        </Box>
      ) : stats.instances.length ? (
        <>
          {stats.instances.map((instance) => (
            <ResourceUsageWidget
              stats={instance.stats.metrics}
              title={
                instance.stats.instanceName === stats.selfInstanceName
                  ? stats.selfInstanceName
                  : `${instance.stats.remoteAddress} - ${instance.stats.instanceName}`
              }
              instanceKey={`${instance.stats.remoteAddress}-${instance.stats.instanceName}`}
              key={instance.stats.remoteAddress}
              status={instance.isHealthy}
              mt={instance.stats.instanceName !== stats.selfInstanceName}
            />
          ))}
        </>
      ) : null}
    </Box>
  );
};

export default SystemStats;
