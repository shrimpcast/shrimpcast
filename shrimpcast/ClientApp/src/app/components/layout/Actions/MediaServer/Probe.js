import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Typography,
  Paper,
} from "@mui/material";
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

const Probe = ({ onSuccess, value }) => {
  const [loading, setLoading] = useState(false),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [open, setOpen] = useState(false),
    [customHeaders, setCustomHeaders] = useState([]);

  const displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    closeToast = () => setShowToast(false),
    executeProbe = async () => {
      setLoading(true);
      const response = await MediaServerManager.Probe(value, customHeaders);
      setLoading(false);
      if (!response || typeof response === "string") {
        displayToast(response || "Error: network error. Try again.");
        return;
      }
      displayToast("Probe successful");
      onSuccess();
      handleClose();
    },
    handleOpen = () => setOpen(true),
    handleClose = () => {
      setOpen(false);
      setCustomHeaders([]);
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
      <Button disabled={loading} onClick={handleOpen} variant="contained" color="success" sx={ProbeButtonSx}>
        <Box sx={ProbeButtonTextSx}>
          <Typography variant="overline">PROBE</Typography>
          {loading && <CircularProgress size={12} thickness={5} sx={{ mb: "5px" }} />}
        </Box>
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography component="span" variant="h6" fontWeight="bold">
            Probe source
          </Typography>
          <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
            {value}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </DialogTitle>

        <DialogContent>
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
        </DialogContent>
      </Dialog>
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

export default Probe;
