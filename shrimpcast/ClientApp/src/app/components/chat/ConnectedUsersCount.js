import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import CircleIcon from "@mui/icons-material/Circle";
import ChatActionsManager from "../../managers/ChatActionsManager";
import SignalRManager from "../../managers/SignalRManager";

const UserCountSx = {
  bgcolor: "primary.900",
  borderRadius: "0px",
  position: "relative",
  width: "100%",
  textAlign: "center",
  maxHeight: "28px",
  height: "28px",
  display: "flex",
  justifyContent: "center",
  overflow: "hidden",
};

const ConnectedUsersCount = (props) => {
  const isConnected = props.connectionStatus === "Connected",
    signalR = props.signalR,
    [connectedUsers, setConnected] = useState({
      byIp: null,
      byConnection: null,
    });

  useEffect(() => {
    const triggerCountChange = async () => await ChatActionsManager.TriggerCountChange(signalR);
    signalR.on(SignalRManager.events.userCountChange, (resp) => setConnected(resp));
    triggerCountChange();
    return () => signalR.off(SignalRManager.events.userCountChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={UserCountSx}>
      <Box marginTop="4px">
        {isConnected ? (
          <CircleIcon color="success" fontSize="small" />
        ) : (
          <CircularProgress color="secondary" size={14} />
        )}
      </Box>
      <Typography ml="5px" mt="2px">
        {isConnected
          ? `${connectedUsers.byIp ?? "-"} connected ${
              props.isAdmin ? ` (${connectedUsers.byConnection ?? "-"} total)` : ""
            }`
          : props.connectionStatus}
      </Typography>
    </Paper>
  );
};

export default ConnectedUsersCount;
