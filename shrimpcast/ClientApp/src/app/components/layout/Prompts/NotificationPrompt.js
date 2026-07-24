import { Alert, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { blue, lightBlue } from "@mui/material/colors";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import ServiceWorkerManager from "../../../managers/ServiceWorkerManager";

const IconSx = {
  backgroundColor: blue[700],
  borderRadius: "0px",
  "&.Mui-disabled": {
    backgroundColor: blue[900],
  },
};

const NotificationPrompt = (props) => {
  const { configuration } = props,
    [loading, setLoading] = useState(false),
    [showNotificationsPrompt, setShowNotificationsPrompt] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [showToast, setShowToast] = useState(false),
    closeToast = () => setShowToast(false),
    askForPermission = async () => {
      if (loading) return;
      let response;
      setLoading(true);

      try {
        response = await ServiceWorkerManager.registerSWSubscription(configuration.vapidPublicKey, props.signalR);
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
      if (!response) {
        setToastMessage(
          "Could not subscribe to notifications. Possible reasons: incognito window, blocked notifications.",
        );
        setShowToast(true);
        return;
      }
      setShowNotificationsPrompt(false);
      setToastMessage("Enabled stream notifications");
      setShowToast(true);
    };

  useEffect(() => {
    const notificationsFeatureAvailable = "serviceWorker" in navigator && "Notification" in window;
    if (!notificationsFeatureAvailable) return;

    const showPrompt = async () => {
      const registration = await ServiceWorkerManager.getSWregistration();
      const isSubscribed = await ServiceWorkerManager.isSubscribed(registration);
      setShowNotificationsPrompt(isSubscribed);
    };

    showPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showNotificationsPrompt && (
        <Tooltip title={"Subscribe to notifications"} arrow>
          <IconButton onClick={askForPermission} type="button" size="small" sx={IconSx} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: lightBlue[900] }} />
            ) : (
              <NotificationsIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </Tooltip>
      )}
      {showToast && (
        <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
          <Alert
            severity={toastMessage.includes("Enabled") ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationPrompt;
