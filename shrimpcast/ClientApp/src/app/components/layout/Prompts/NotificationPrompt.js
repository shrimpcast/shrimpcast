import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  keyframes,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { blue, blueGrey } from "@mui/material/colors";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import ServiceWorkerManager from "../../../managers/ServiceWorkerManager";

const IconSx = (isMobile) => ({
    backgroundColor: blue[700],
    "&.Mui-disabled": {
      backgroundColor: blue[700],
    },
    position: "relative",
    zIndex: 1,
    height: "31px",
    width: "32px",
    borderRadius: "0px",
  }),
  spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,
  ContainerSx = (isMobile, loading) => ({
    position: "relative",
    backgroundColor: blue[700],
    borderRadius: isMobile ? "5px" : "0px",
    display: "inline-flex",
    padding: "2px",
    cursor: loading ? "not-allowed" : "pointer",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "-50%",
      background: `conic-gradient(from 0deg, transparent 0%, ${blue[300]} 15%, transparent 30%)`,
      animation: `${spin} 1.5s linear infinite`,
    },
  }),
  ToastSx = (theme, toastMessage) => ({
    width: "100%",
    backgroundColor: (theme) =>
      `${toastMessage.includes("Enabled") ? theme.palette.success.main : theme.palette.error.main} !important`,
  });

const NotificationButton = ({ loading, askForPermission, isMobile }) => {
  return (
    <Tooltip title={"Subscribe to notifications"} arrow>
      <Box sx={ContainerSx(isMobile, loading)}>
        <IconButton
          onClick={askForPermission}
          type="button"
          size="small"
          sx={IconSx(isMobile)}
          id={"notifications-button"}
          disabled={loading}
        >
          {loading ? (
            <Typography mt="7px">
              <CircularProgress size={24} sx={{ color: blueGrey[900] }} />
            </Typography>
          ) : (
            <NotificationsIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

const NotificationPrompt = (props) => {
  const { configuration, sx } = props,
    [loading, setLoading] = useState(false),
    [showNotificationsPrompt, setShowNotificationsPrompt] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [showToast, setShowToast] = useState(false),
    closeToast = () => setShowToast(false),
    askForPermission = async () => {
      if (loading) return;
      let response;
      setLoading(true);

      const errorCallback = (message) => {
        setToastMessage(`Could not subscribe to notifications: ${message}`);
        setShowToast(true);
      };

      try {
        response = await Promise.race([
          ServiceWorkerManager.registerSWSubscription(configuration.vapidPublicKey, props.signalR),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 7500)),
        ]);
      } catch (e) {
        errorCallback(`[${e.message.toLowerCase()}]`);
        return;
      } finally {
        setLoading(false);
      }

      if (!response) {
        errorCallback("unknown reason.");
        return;
      }

      setShowNotificationsPrompt(false);
      setToastMessage("Enabled stream notifications");
      setShowToast(true);
      document.dispatchEvent(new CustomEvent("endTutorial"));
    },
    theme = useTheme(),
    isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const notificationsFeatureAvailable = "serviceWorker" in navigator && "Notification" in window;
    if (!notificationsFeatureAvailable) return;

    const shouldShowPrompt = async () => {
      const isSubscribed = await ServiceWorkerManager.isSubscribed();
      setShowNotificationsPrompt(!isSubscribed);
    };

    shouldShowPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box hidden={!showNotificationsPrompt}>
        {isMobile ? (
          <MenuItem sx={sx(blue)}>
            <NotificationButton loading={loading} askForPermission={askForPermission} isMobile={isMobile} />
          </MenuItem>
        ) : (
          <NotificationButton loading={loading} askForPermission={askForPermission} />
        )}
      </Box>
      {showToast && (
        <Snackbar open={true} autoHideDuration={5000} onClose={closeToast}>
          <Alert
            variant="filled"
            severity={toastMessage.includes("Enabled") ? "success" : "error"}
            sx={ToastSx(theme, toastMessage)}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationPrompt;
