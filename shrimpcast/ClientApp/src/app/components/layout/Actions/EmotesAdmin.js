import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useState } from "react";
import {
  Box,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  Button,
  Avatar,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmoteManager from "../../../managers/EmoteManager";
import AddEmoteDialog from "./Emotes/AddEmoteDialog";

const EmotesAdmin = (props) => {
  const [open, setOpen] = useState(false),
    [emotes, setEmotes] = useState(props.emotes),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    removeEmote = async (emoteId) => {
      const isRemoved = await EmoteManager.Remove(props.signalR, emoteId);
      if (!isRemoved) return;
      setEmotes((emotes) => emotes.filter((emote) => emote.emoteId !== emoteId));
    },
    [addEmoteOpened, setAddEmoteOpened] = useState(false),
    openAddEmotes = () => setAddEmoteOpened(true),
    closeAddEmotes = () => setAddEmoteOpened(false);

  return (
    <>
      <Tooltip title="Emotes">
        <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
          <InsertEmoticonIcon sx={{ color: "primary.500" }} />
        </IconButton>
      </Tooltip>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            <Box display="flex" width="100%" marginBottom={"10px"}>
              Manage emotes
              <Button onClick={openAddEmotes} sx={{ marginLeft: "auto" }} variant="contained" color="success">
                Add
              </Button>
              {addEmoteOpened && (
                <AddEmoteDialog
                  emotes={emotes}
                  setEmotes={setEmotes}
                  signalR={props.signalR}
                  open={addEmoteOpened}
                  close={closeAddEmotes}
                />
              )}
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {emotes.map((emote) => (
                <ListItem
                  key={emote.emoteId}
                  secondaryAction={
                    <IconButton onClick={() => removeEmote(emote.emoteId)} edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Avatar alt={emote.alt} sx={{ width: "30px", height: "30px", mr: "10px" }} src={emote.url} />
                  <Typography>{emote.name}</Typography>
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EmotesAdmin;
