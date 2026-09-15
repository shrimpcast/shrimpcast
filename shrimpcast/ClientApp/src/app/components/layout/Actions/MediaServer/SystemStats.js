import { useEffect, useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";
import ResourceUsageWidget from "./ResourceUsageWidget";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

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

const SystemStats = ({ selfInstanceOnly }) => {
  const defaultModel = {
      selfInstanceName: null,
      instances: [],
    },
    [stats, setStats] = useState(defaultModel);

  useEffect(() => {
    const fetchStats = async (abortControllerSignal) => {
      const response = await MediaServerManager.GetSystemStats(abortControllerSignal, selfInstanceOnly);
      if (abortControllerSignal?.aborted) return;
      setStats(response || defaultModel);
      setTimeout(() => fetchStats(abortControllerSignal), 1000);
    };

    const abortController = new AbortController();
    fetchStats(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !selfInstanceOnly && !stats.instances.length ? null : (
    <Grid container sx={BoxSx} spacing={selfInstanceOnly ? 0 : 1}>
      {!stats.selfInstanceName ? (
        <Box sx={LoaderSx}>
          <CircularProgress color="secondary" />
        </Box>
      ) : stats.instances.length ? (
        <>
          {stats.instances.map((instance) => (
            <Grid
              xs={12}
              sm={selfInstanceOnly ? 12 : 6}
              md={selfInstanceOnly ? 12 : 4}
              lg={selfInstanceOnly ? 12 : 3}
              key={`${instance.stats.remoteAddress}-${instance.stats.instanceName}`}
              sx={{ flexGrow: "1 !important" }}
            >
              <ResourceUsageWidget
                stats={instance.stats.metrics}
                title={
                  instance.stats.instanceName === stats.selfInstanceName
                    ? stats.selfInstanceName
                    : `LB node: [${instance.stats.instanceName} - ${instance.stats.remoteAddress}]`
                }
                instanceKey={`${instance.stats.remoteAddress}-${instance.stats.instanceName}`}
                status={instance.isHealthy}
                mt={instance.stats.instanceName !== stats.selfInstanceName}
              />
            </Grid>
          ))}
        </>
      ) : null}
    </Grid>
  );
};

export default SystemStats;
