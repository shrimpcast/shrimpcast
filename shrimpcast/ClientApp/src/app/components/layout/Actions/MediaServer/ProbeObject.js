import { Alert, Box, Button, CircularProgress, Divider, Snackbar, Typography, Paper } from "@mui/material";
import { useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";
import GenericAddObjectTable from "../GenericAddObjectTable";

const ProbeButtonSx = {
  display: "block",
  width: "100%",
  height: "38px",
  fontWeight: "bold",
  borderRadius: "0 0 8px 8px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  boxShadow: "none",
};

const ProbeButtonTextSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontWeight: "bold",
};

const ProbeObject = ({ setStreams, url, title, type }) => {
  const [loading, setLoading] = useState(false),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [customHeaders, setCustomHeaders] = useState([]);

  const displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    closeToast = () => setShowToast(false),
    executeProbe = async () => {
      setLoading(true);
      const response = await MediaServerManager.Probe(url, customHeaders);
      setLoading(false);
      if (!response || typeof response === "string") {
        displayToast(response || "Error: network error. Try again.");
        return;
      }
      displayToast("Probe successful");

      const streams = {};
      if (type === "all" || type === "video") {
        streams.videoStreams = response.streams.filter((s) => s.codec_type === "video");
        streams.videoStreamsMapped = streams.videoStreams.map((stream) => ({
          label: `STREAM [${stream.index}]`,
          index: stream.index,
        }));
      }

      if (type === "all" || type === "audio") {
        streams.audioStreams = response.streams.filter((s) => s.codec_type === "audio");
        streams.audioStreamsMapped = streams.audioStreams.map((stream) => ({
          label: `STREAM [${stream.index}]`,
          index: stream.index,
        }));
      }

      setStreams(streams);
    },
    tableModel = {
      fields: [
        { name: "header", label: "Header name", type: 2, color: "success" },
        { name: "value", label: "Value", type: 2, color: "success" },
      ],
      requiredFields: ["header", "value"],
      reservedWords: [],
      reservedWordField: "header",
      model: { header: "", value: "" },
      identifier: "header",
      itemsKey: "headers",
      customActions: {
        add: async (_, header) => header,
        edit: async () => true,
        remove: async () => true,
      },
    };

  return (
    <>
      <Box
        sx={{
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography component="span" variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
          {url}
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mb: 1 }}>
          Custom headers
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <GenericAddObjectTable
          title="Custom headers"
          items={customHeaders}
          setItems={setCustomHeaders}
          {...tableModel}
        />
      </Paper>

      <Button
        disabled={loading}
        onClick={executeProbe}
        variant="contained"
        color="info"
        sx={{
          ...ProbeButtonSx,
          borderRadius: "8px",
          boxShadow: 2,
          mt: 1,
        }}
      >
        <Box sx={ProbeButtonTextSx}>
          <Typography variant="overline">RUN PROBE</Typography>
          {loading && <CircularProgress size={12} thickness={5} sx={{ mb: "5px" }} />}
        </Box>
      </Button>

      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
        <Alert
          severity={toastMessage.includes("Error") ? "error" : "success"}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">{toastMessage}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProbeObject;
