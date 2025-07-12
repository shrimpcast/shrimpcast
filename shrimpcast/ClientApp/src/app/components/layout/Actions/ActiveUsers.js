import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ManageUserDialog from "../../chat/ManageUserDialog";
import SignalRManager from "../../../managers/SignalRManager";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ConnectedUsersSx = (isAdmin) => ({
  borderRadius: "5px",
  width: "24px",
  height: "20px",
  position: "relative",
  bottom: "1px",
  ml: isAdmin ? "5px" : "2.5px",
});

const ActiveUsers = (props) => {
  const [open, setOpen] = useState(false),
    [openedOnce, setOpenedOnce] = useState(false),
    [users, setUsers] = useState(null),
    setClosed = () => setOpen(false),
    setOpened = () => {
      setOpen(true);
      if (!openedOnce) setOpenedOnce(true);
    },
    { signalR, isAdmin } = props;

  useEffect(() => {
    if (!openedOnce) return;

    const addUser = (user) =>
        setUsers((users) => {
          const userExists = users.find((existingUser) => existingUser.sessionId === user.sessionId);
          return userExists ? users : users.concat(user);
        }),
      removeUser = (sessionId) => setUsers((users) => users.filter((user) => user.sessionId !== sessionId)),
      nameChange = ({ sessionId, newName }) =>
        setUsers((users) =>
          users.map((existingUser) =>
            existingUser.sessionId !== sessionId ? existingUser : { ...existingUser, name: newName }
          )
        );

    const getUsers = async () => {
      const activeUsers = await AdminActionsManager.GetActiveUsers(signalR);
      setUsers(activeUsers || []);
      if (!activeUsers) setOpenedOnce(false);
      signalR.on(SignalRManager.events.userConnected, addUser);
      signalR.on(SignalRManager.events.userDisconnected, removeUser);
      signalR.on(SignalRManager.events.nameChange, nameChange);
    };

    getUsers();
    return () => {
      signalR.off(SignalRManager.events.userConnected);
      signalR.off(SignalRManager.events.userDisconnected);
      signalR.off(SignalRManager.events.nameChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedOnce]);

  return (
    <>
      <Tooltip title="Show connected users">
        <Chip
          icon={<VisibilityIcon sx={{ position: "relative", left: "4px" }} />}
          size="small"
          color="primary"
          sx={ConnectedUsersSx(isAdmin)}
          onClick={setOpened}
        />
      </Tooltip>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", pb: "7.5px" }}>
            <Box display="flex" width="100%" mb={"10px"}>
              Connected users
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            {!users ? (
              <Box width="40px" ml="auto" mr="auto">
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 1 }}>
                {users?.map((user, index) => (
                  <ListItem
                    divider={index !== users.length - 1}
                    key={user.sessionId}
                    secondaryAction={
                      <ManageUserDialog
                        {...props}
                        siteAdmin={props.isAdmin}
                        siteMod={props.isMod}
                        userSessionId={props.sessionId}
                        useSession={true}
                        sessionId={user.sessionId}
                      />
                    }
                  >
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActiveUsers;
