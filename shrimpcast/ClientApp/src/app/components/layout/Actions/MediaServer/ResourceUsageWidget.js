import { Box, Typography, LinearProgress, Stack, Divider, IconButton, Zoom } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MediaServerManager from "../../../../managers/MediaServerManager";
import { useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";

const HealthStatusSx = (status) => ({
    padding: 1,
    bgcolor: status ? "success.dark" : "error.dark",
    borderRadius: 2,
  }),
  UpdateDiskSx = { height: "20px", position: "relative", bottom: "2px" },
  defaultDisk = { numeric: -1, _string: "-", loading: false };

const ResourceUsageWidget = ({ stats, title, mt, status, instanceKey, host, token }) => {
  const [isRemoved, setIsRemoved] = useState(false),
    [diskUsage, setDiskUsage] = useState(defaultDisk),
    removeInstance = async () => {
      const removed = await MediaServerManager.RemoveInstanceMetrics(instanceKey);
      removed && setIsRemoved(true);
    },
    getDiskUsage = async () => {
      setDiskUsage({ ...defaultDisk, loading: true });
      const response = await MediaServerManager.GetDiskUsage(host, token);
      let usage = response;
      if (!usage?._string) {
        usage = defaultDisk;
        usage._string = "-";
      }
      setDiskUsage({ ...usage, loading: false });
    };

  return isRemoved ? null : (
    <Zoom in={true}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mt={mt ? 1 : 0} gutterBottom>
          {title}
          {mt && (
            <IconButton type="button" size="small" ml="auto" onClick={removeInstance}>
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          )}
          <Divider />
        </Typography>
        <Stack spacing={1.2} sx={mt ? HealthStatusSx(status) : null}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              CPU: {stats.cpu._string}
            </Typography>
            <LinearProgress
              color={stats.cpu.numeric > 75 ? "error" : stats.cpu.numeric > 50 ? "warning" : "primary"}
              variant="determinate"
              value={stats.cpu.numeric}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              RAM: {stats.memory._string}
            </Typography>
            <LinearProgress
              variant="determinate"
              color={stats.memory.numeric > 75 ? "error" : stats.memory.numeric > 50 ? "warning" : "secondary"}
              value={stats.memory.numeric}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              DISK: {diskUsage._string}
              {!diskUsage.loading ? (
                <IconButton
                  type="button"
                  size="small"
                  sx={UpdateDiskSx}
                  disabled={diskUsage.loading}
                  onClick={getDiskUsage}
                >
                  <ReplayIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              ) : null}
            </Typography>
            <LinearProgress
              variant="determinate"
              color={diskUsage.numeric > 75 ? "error" : diskUsage.numeric > 50 ? "warning" : "info"}
              value={diskUsage.numeric}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Network upload: {stats.network._string}
            </Typography>
          </Box>

          {stats.totalViewers !== -1 ? (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {stats.totalViewers} total viewers playing streams
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>
    </Zoom>
  );
};

export default ResourceUsageWidget;
