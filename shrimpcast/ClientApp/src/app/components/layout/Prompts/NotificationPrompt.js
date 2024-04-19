import { Alert } from "@mui/material";
import { blue } from "@mui/material/colors";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import Snackbar from "@mui/material/Snackbar";
import ServiceWorkerManager from "../../../managers/ServiceWorkerManager";
import NotificationBar from "./NotificationBar";

const NotificationPrompt = (props) => {
  const { subscribed, configuration } = props,
    [loading, setLoading] = useState(false),
    [showNotificationsPrompt, setShowNotificationsPrompt] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [showToast, setShowToast] = useState(false),
    closeToast = () => setShowToast(false),
    hideNotificationsPrompt = () => {
      LocalStorageManager.hideNotificationsPrompt();
      setShowNotificationsPrompt(false);
    },
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
        setToastMessage("Could not subscribe to notifications");
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
    const permission = Notification.permission;
    const notHiddenByUser = LocalStorageManager.shouldShowNotificationsPrompt();
    const shouldShowPrompt = notHiddenByUser && permission !== "denied" && (!subscribed || permission !== "granted");
    if (!shouldShowPrompt) return;
    const showPrompt = async () => {
      await ServiceWorkerManager.getSWregistration();
      setShowNotificationsPrompt(true);
    };

    showPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showNotificationsPrompt && (
        <NotificationBar
          onClick={askForPermission}
          close={hideNotificationsPrompt}
          text="ENABLE STREAM NOTIFICATIONS"
          loading={loading}
          icon={NotificationsIcon}
          palette={blue}
        />
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
