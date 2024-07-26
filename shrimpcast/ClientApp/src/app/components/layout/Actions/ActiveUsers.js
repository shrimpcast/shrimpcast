import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { Box, DialogContent, Divider, IconButton, List, ListItem, ListItemText } from "@mui/material";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ManageUserDialog from "../../chat/ManageUserDialog";
import SignalRManager from "../../../managers/SignalRManager";

const ActiveUsers = (props) => {
  const [open, setOpen] = useState(false),
    [users, setUsers] = useState([]),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    { signalR } = props;

  useEffect(() => {
    const addUser = (user) =>
        setUsers((users) => {
          const userExists = users.find((existingUser) => existingUser.sessionId === user.sessionId);
          return userExists ? users : users.concat(user);
        }),
      removeUser = (sessionId) => setUsers((users) => users.filter((user) => user.sessionId !== sessionId));

    const getUsers = async () => {
      signalR.on(SignalRManager.events.userConnected, addUser);
      signalR.on(SignalRManager.events.userDisconnected, removeUser);
      const activeUsers = await AdminActionsManager.GetActiveUsers(signalR);
      setUsers(activeUsers || []);
    };

    getUsers();
    return () => {
      signalR.off(SignalRManager.events.userConnected);
      signalR.off(SignalRManager.events.userDisconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
        <PeopleAltIcon sx={{ color: "primary.500" }} />
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", pb: "7.5px" }}>
            <Box display="flex" width="100%" mb={"10px"}>
              Active users list
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {users?.map((user) => (
                <ListItem
                  key={user.sessionId}
                  secondaryAction={
                    <ManageUserDialog
                      {...props}
                      siteAdmin={props.isAdmin}
                      useSession={true}
                      sessionId={user.sessionId}
                    />
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActiveUsers;
