import { Box, Typography, LinearProgress, Stack, Divider, IconButton, Zoom, Tooltip } from "@mui/material";
import {
  Close as CloseIcon,
  DownloadRounded as DownloadRoundedIcon,
  UploadRounded as UploadRoundedIcon,
} from "@mui/icons-material";
import MediaServerManager from "../../../../managers/MediaServerManager";

const HealthStatusSx = (status) => ({
    padding: 1,
    bgcolor: status ? "success.dark" : "error.dark",
    borderRadius: 2,
  }),
  TitleSx = {
    whiteSpace: "nowrap",
    fontWeight: 600,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  NStatusCSx = {
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
  },
  NetworkItemSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 1.5,
    py: 1,
    borderRadius: 2,
    bgcolor: "action.hover",
    flex: "1 1 140px",
    minWidth: 0,
  };

const ResourceUsageWidget = ({ stats, title, mt, status, instanceKey, removeCallback }) => {
  const removeInstance = async () => {
    const removed = await MediaServerManager.RemoveInstanceMetrics(instanceKey);
    removed && removeCallback(instanceKey);
  };

  return (
    <Zoom in={true}>
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ display: "flex" }}>
          <Typography sx={TitleSx}>{title}</Typography>
          {mt && (
            <Tooltip title="Remove node">
              <IconButton type="button" size="small" ml="auto" onClick={removeInstance}>
                <CloseIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Tooltip>
          )}
          <Divider />
        </Typography>
        <Stack spacing={1.2} sx={mt ? HealthStatusSx(status) : null}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              CPU: {stats.cpu._string}
            </Typography>
            <LinearProgress
              color={stats.cpu.numeric > 75 ? "error" : stats.cpu.numeric > 50 ? "warning" : "success"}
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
              color={stats.memory.numeric > 75 ? "error" : stats.memory.numeric > 50 ? "warning" : "success"}
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
              color={stats.disk.numeric > 75 ? "error" : stats.disk.numeric > 50 ? "warning" : "success"}
              value={stats.disk.numeric}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          {stats.totalViewers !== -1 ? (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {stats.totalViewers} total viewers playing streams
              </Typography>
            </Box>
          ) : null}

          <Box sx={NStatusCSx}>
            <Box sx={NetworkItemSx}>
              <DownloadRoundedIcon sx={{ color: "success.main", fontSize: 20 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Download
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {stats.networkDownload?._string}
                </Typography>
              </Box>
            </Box>

            <Box sx={NetworkItemSx}>
              <UploadRoundedIcon sx={{ color: "info.main", fontSize: 20 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Upload
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {stats.networkUpload?._string}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Zoom>
  );
};

export default ResourceUsageWidget;
