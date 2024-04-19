import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { Box, DialogContent, Divider, IconButton, List, ListItem, ListItemText } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";

const Bans = (props) => {
  const [open, setOpen] = useState(false),
    [bans, setBans] = useState([]),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    getBans = async () => {
      const bans = await AdminActionsManager.GetBans(props.signalR);
      setBans(bans);
    },
    unban = async (banId) => {
      const isRemoved = ChatActionsManager.Unban(props.signalR, banId);
      if (!isRemoved) return;
      setBans((bans) => bans.filter((ban) => ban.banId !== banId));
    };

  useEffect(() => {
    if (open) getBans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
        <BlockIcon sx={{ color: "primary.500" }} />
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            <Box display="flex" width="100%" marginBottom={"10px"}>
              Banned users list
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {bans.map((ban) => (
                <ListItem
                  key={ban.banId}
                  secondaryAction={
                    <IconButton onClick={() => unban(ban.banId)} edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={ban.sessionName} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Bans;
