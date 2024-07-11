import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageUserDialog from "../../chat/ManageUserDialog";
import GenericAddTextItemDialog from "./GenericAddTextItemDialog";

const GenericActionList = (props) => {
  const [open, setOpen] = useState(props.skipButton || false),
    [addDialogOpened, setAddDialogOpened] = useState(false),
    openAddDialog = () => setAddDialogOpened(true),
    [items, setItems] = useState(null),
    setClosed = () => {
      setItems(null);
      setOpen(false);
      props.closeCallback && props.closeCallback();
    },
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
      {!props.skipButton && (
        <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
          <Icon sx={{ color: "primary.500" }} />
        </IconButton>
      )}
      <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
        <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
          <Box display="flex" width="100%" marginBottom={"10px"}>
            {props.title}
            {props.customButton && (
              <Button onClick={openAddDialog} sx={{ marginLeft: "auto" }} variant="contained" color="success">
                {props.customButton}
              </Button>
            )}
          </Box>
          <Divider />
        </DialogTitle>
        <DialogContent>
          {!items ? (
            <Box width="40px" ml="auto" mr="auto">
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {!items.length ? (
                <Typography ml={1}>No entries found</Typography>
              ) : (
                items.map((item) => (
                  <ListItem
                    key={item[props.identifier]}
                    secondaryAction={
                      <>
                        {item.sessionId && (
                          <ManageUserDialog
                            {...props}
                            siteAdmin={props.isAdmin}
                            siteMod={props.isMod}
                            useSession={true}
                            sessionId={item.sessionId}
                          />
                        )}
                        {props.removeItem && (
                          <IconButton onClick={() => removeItem(item[props.identifier])} edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText primary={item[props.contentIdentifier]} sx={{ wordBreak: "break-word" }} />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {addDialogOpened && (
        <GenericAddTextItemDialog setItems={setItems} setAddDialogOpened={setAddDialogOpened} {...props} />
      )}
    </>
  );
};

export default GenericActionList;
