import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  useTheme,
  Fade,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CodeIcon from "@mui/icons-material/Code";
import MediaServerManager from "../../../../managers/MediaServerManager";
import VideoJSPlayer from "../../../player/VideoJSPlayer";
import HtmlIcon from "@mui/icons-material/Html";

const BoxSx = {
    maxHeight: "200px",
    overflowY: "auto",
    width: "100%",
    boxShadow: 3,
    bgcolor: "background.paper",
    mt: 1,
    p: 1.5,
    mr: 1,
    borderRadius: 3,
  },
  CardSx = (theme) => ({
    borderRadius: 2,
    borderColor: "divider",
    transition: "0.25s ease",
    "&:hover": {
      boxShadow: 4,
      transform: "translateY(-2px)",
      borderColor: theme.palette.primary.main,
    },
    overflowX: "auto",
  }),
  CardContentSx = { pb: "0px !important", pt: 0, pl: 2, pr: 2 },
  StreamTitleSx = {
    textTransform: "uppercase",
    position: "relative",
    top: "2px",
    fontSize: 18,
    fontWeight: 700,
    color: "text.primary",
    mr: "5px",
  },
  JsonPreviewSX = {
    p: 2,
    borderRadius: 2,
    bgcolor: "grey.900",
    color: "grey.100",
    fontSize: 13,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflow: "auto",
    maxHeight: "70vh",
  },
  DialogTitleSx = (theme) => ({
    fontWeight: 700,
    borderBottom: "1px solid",
    borderColor: "divider",
    backgroundColor: theme.palette.background.default,
  }),
  StackCardSx = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    spacing: 1,
  },
  ProcessInfoSx = {
    fontWeight: 600,
    position: "relative",
    top: "7.5px",
    color: "text.secondary",
  };

const StreamStats = () => {
  const [stats, setStats] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [logsLoading, setLogsLoading] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async (signal) => {
      const response = await MediaServerManager.GetStreamStats(signal);
      if (signal.aborted) return;
      setStats(response || null);
      setTimeout(() => fetchStats(signal), 1000);
    };
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, []);

  const handleOpenDialog = (stat, type) => {
    setSelectedItem(stat);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDialogType(null);
  };

  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(window.location.origin + selectedItem.streamUrl);
    setSnackbarOpen(true);
  };

  const handleCopyEmbedCode = (copyCode) => {
    const origin = window.location.origin,
      name = selectedItem.name,
      url = origin + selectedItem.streamUrl,
      embedUrl = `${origin}/embed?url=${url}&autoplay=true`,
      embedCode = `<iframe src="${embedUrl}" title="embed-${name}" id="embed-${name}" allow="autoplay" frameBorder="no" scrolling="no" allowFullScreen></iframe>`;

    navigator.clipboard.writeText(copyCode ? embedCode : embedUrl);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const getLogs = async (stream) => {
    setLogsLoading(stream);
    const logs = await MediaServerManager.GetStreamLogs(stream);
    setLogsLoading(null);
    handleOpenDialog({ rawJsonSettings: logs }, "json");
  };

  return (
    <Fade in timeout={400}>
      <Box sx={BoxSx} className="scrollbar-custom">
        <Box mb={1}>
          <Typography display="flex" width="100%" variant="subtitle1" fontWeight={600} gutterBottom>
            Active stream processes
            <Button
              sx={{ marginLeft: "auto" }}
              disabled={logsLoading}
              size="small"
              variant="outlined"
              onClick={() => getLogs("_server_")}
            >
              MEDIA SERVER LOGS {logsLoading && <CircularProgress sx={{ ml: "4px" }} size={12} />}
            </Button>
          </Typography>
          <Divider />
        </Box>

        {stats === null ? (
          <Box width="40px" ml="auto" mr="auto" mt={2}>
            <CircularProgress color="secondary" />
          </Box>
        ) : stats.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            No active streams
          </Typography>
        ) : (
          <Stack spacing={2}>
            {stats.map((stat, idx) => (
              <Card key={idx} variant="outlined" sx={CardSx(theme)} className="scrollbar-custom">
                <CardContent sx={CardContentSx}>
                  <Stack sx={StackCardSx}>
                    <Typography variant="overline" sx={StreamTitleSx}>
                      {stat.name}
                    </Typography>

                    <Stack minWidth="600px" justifyContent="end" direction="row" spacing={1.2}>
                      {stat.processStatus.runningStatus === "Connected" && (
                        <>
                          <Typography sx={ProcessInfoSx} variant="caption">
                            {stat.processStatus.runningTime}
                          </Typography>
                          {stat.processStatus.bitrate ? (
                            <Typography sx={ProcessInfoSx} variant="caption">
                              {stat.processStatus.bitrate}kbps
                            </Typography>
                          ) : null}
                          <Typography sx={ProcessInfoSx} variant="caption">
                            {stat.processStatus.cpuUsage}
                          </Typography>
                        </>
                      )}

                      <Chip
                        label={stat.processStatus.runningStatus}
                        color={
                          stat.processStatus.runningStatus === "Stopping"
                            ? "error"
                            : stat.processStatus.runningStatus === "Connected"
                            ? "success"
                            : stat.processStatus.runningStatus === "Connecting"
                            ? "info"
                            : "warning"
                        }
                        size="small"
                        variant="overline"
                        sx={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          position: "relative",
                          top: "3.5px",
                        }}
                      />
                      {stat.processStatus.runningStatus === "Connected" && (
                        <Button
                          size="small"
                          variant="contained"
                          disableElevation
                          onClick={() => handleOpenDialog(stat, "preview")}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        disabled={logsLoading === stat.name}
                        size="small"
                        variant="outlined"
                        onClick={() => getLogs(stat.name)}
                      >
                        LOGS {logsLoading === stat.name && <CircularProgress sx={{ ml: "4px" }} size={12} />}
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => handleOpenDialog(stat, "json")}>
                        JSON
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
        {selectedItem && (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle sx={DialogTitleSx(theme)}>
              {dialogType === "json" ? "Debug information" : "Stream preview"}
              {dialogType === "preview" && (
                <>
                  <Tooltip title="Copy M3U8 URL">
                    <IconButton onClick={handleCopyStreamUrl} size="small" sx={{ ml: 1 }}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy embed URL">
                    <IconButton onClick={() => handleCopyEmbedCode(false)} size="small" sx={{ ml: 1 }}>
                      <CodeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy embed code">
                    <IconButton onClick={() => handleCopyEmbedCode(true)} size="small" sx={{ ml: 1 }}>
                      <HtmlIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </DialogTitle>
            <DialogContent
              sx={{
                px: 2,
                py: 2,
                backgroundColor: dialogType === "json" ? theme.palette.grey[900] : theme.palette.background.paper,
              }}
              dividers
            >
              {dialogType === "json" ? (
                <Box component="pre" sx={JsonPreviewSX} className="scrollbar-custom">
                  {JSON.stringify(selectedItem.rawJsonSettings, null, 2)?.replace(/\\"/g, '"')}
                </Box>
              ) : (
                <Box sx={{ height: "600px", borderRadius: 2 }}>
                  <VideoJSPlayer
                    options={{
                      autoplay: true,
                      controls: true,
                      fill: true,
                      playsinline: true,
                      html5: { vhs: { withCredentials: false } },
                      sources: [
                        {
                          src: window.location.origin + selectedItem?.streamUrl,
                          type: "application/x-mpegURL",
                        },
                      ],
                    }}
                    theme={theme}
                  />
                  <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
                    <Alert severity="success" sx={{ width: "100%" }}>
                      URL copied to clipboard
                    </Alert>
                  </Snackbar>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Fade>
  );
};

export default StreamStats;
