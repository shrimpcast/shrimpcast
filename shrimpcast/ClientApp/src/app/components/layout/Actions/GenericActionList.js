import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { Box, DialogContent, Divider, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageUserDialog from "../../chat/ManageUserDialog";

const GenericActionList = (props) => {
  const [open, setOpen] = useState(false),
    [items, setItems] = useState([]),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    { signalR } = props,
    getItems = async () => {
      const items = await props.getItems(signalR);
      setItems(items);
    },
    removeItem = async (itemId) => {
      const isRemoved = props.removeItem(signalR, itemId);
      if (!isRemoved) return;
      setItems((items) => items.filter((item) => item[props.identifier] !== itemId));
    },
    Icon = props.icon;

  useEffect(() => {
    if (open) getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
        <Icon sx={{ color: "primary.500" }} />
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            <Box display="flex" width="100%" marginBottom={"10px"}>
              {props.title}
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {items.map((item) => (
                <ListItem
                  key={item[props.identifier]}
                  secondaryAction={
                    <>
                      {item.sessionId && (
                        <ManageUserDialog
                          {...props}
                          siteAdmin={props.isAdmin}
                          useSession={true}
                          isAdmin={false}
                          sessionId={item.sessionId}
                        />
                      )}
                      <IconButton onClick={() => removeItem(item[props.identifier])} edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={item[props.contentIdentifier]} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GenericActionList;
