import { Box, Typography, LinearProgress, Stack, Divider, IconButton, Zoom } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MediaServerManager from "../../../../managers/MediaServerManager";
import { useState } from "react";

const HealthStatusSx = (status) => ({
  padding: 1,
  bgcolor: status ? "success.dark" : "error.dark",
  borderRadius: 2,
});

const ResourceUsageWidget = ({ stats, title, mt, status, instanceKey }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const removeInstance = async () => {
    const removed = await MediaServerManager.RemoveInstanceMetrics(instanceKey);
    removed && setIsRemoved(true);
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
              DISK: {stats.disk._string}
            </Typography>
            <LinearProgress
              variant="determinate"
              color={stats.disk.numeric > 75 ? "error" : stats.disk.numeric > 50 ? "warning" : "info"}
              value={stats.disk.numeric}
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
                {stats.totalViewers} unique IPs playing streams
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>
    </Zoom>
  );
};

export default ResourceUsageWidget;
