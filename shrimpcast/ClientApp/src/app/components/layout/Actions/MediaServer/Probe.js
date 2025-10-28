import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";

const ProbeButtonSx = {
    display: "block",
    width: "100%",
    height: "30px",
    borderTopRightRadius: "0px",
    borderTopLeftRadius: "0px",
  },
  ProbeButtonTextSx = {
    position: "relative",
    bottom: "5px",
    fontWeight: "bold",
  };

const Probe = ({ onSuccess, value }) => {
  const [loading, setLoading] = useState(false),
    displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    closeToast = () => setShowToast(false),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    executeProbe = async () => {
      setLoading(true);
      const response = await MediaServerManager.Probe(value);
      setLoading(false);
      if (typeof response === "string") displayToast(response);
      else displayToast("Probe successful");
    };

  return (
    <>
      <Button disabled={loading} onClick={executeProbe} variant="contained" color="success" sx={ProbeButtonSx}>
        <Typography sx={ProbeButtonTextSx} variant="overline">
          PROBE
        </Typography>
      </Button>

      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
        <Alert severity={toastMessage.includes("Error") ? "error" : "success"} variant="filled" p={2}>
          <Typography variant="body2">{toastMessage}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default Probe;
