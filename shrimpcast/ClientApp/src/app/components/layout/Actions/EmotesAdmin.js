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
import ConfirmDialog from "../../others/ConfirmDialog";

const EmotesAdmin = (props) => {
  const [open, setOpen] = useState(false),
    [emotes, setEmotes] = useState(props.emotes),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    removeEmote = async (emoteId) => {
      const isRemoved = await EmoteManager.Remove(props.signalR, emoteId);
      if (!isRemoved) return;
      setEmotes((emotes) => emotes.filter((emote) => emote.emoteId !== emoteId));
      closeConfirmPrompt();
    },
    [addEmoteOpened, setAddEmoteOpened] = useState(false),
    openAddEmotes = () => setAddEmoteOpened(true),
    closeAddEmotes = () => setAddEmoteOpened(false),
    [showPromptDialog, setShowPromptDialog] = useState({
      open: false,
      name: null,
      id: null,
    }),
    openConfirmPrompt = (name, id) => setShowPromptDialog({ open: true, name, id }),
    closeConfirmPrompt = () => setShowPromptDialog({ open: false, name: null, id: null });

  return (
    <>
      <Tooltip title="Emotes">
        <IconButton
          onClick={setOpened}
          type="button"
          size="small"
          sx={{ backgroundColor: "primary.700", borderRadius: "0px" }}
        >
          <InsertEmoticonIcon sx={{ color: "primary.300" }} />
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
            <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 1 }}>
              {emotes.map((emote, index) => (
                <ListItem
                  divider={index !== emotes.length - 1}
                  key={emote.emoteId}
                  secondaryAction={
                    <IconButton
                      onClick={() => openConfirmPrompt(emote.name, emote.emoteId)}
                      edge="end"
                      aria-label="delete"
                      sx={{
                        "&:hover": {
                          color: "error.main",
                        },
                      }}
                    >
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
      {showPromptDialog.open && (
        <ConfirmDialog
          title={`Are you sure you want to remove ${showPromptDialog.name}?`}
          confirm={() => removeEmote(showPromptDialog.id)}
          cancel={closeConfirmPrompt}
        />
      )}
    </>
  );
};

export default EmotesAdmin;
