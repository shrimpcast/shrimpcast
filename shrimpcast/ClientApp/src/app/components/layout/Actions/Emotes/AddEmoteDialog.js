import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Snackbar, Typography, Alert, CircularProgress } from "@mui/material";
import EmoteManager from "../../../../managers/EmoteManager";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddEmoteDialog = (props) => {
  const [emote, setEmote] = useState(null),
    [name, setName] = useState(""),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [loading, setLoading] = useState(false),
    closeToast = () => setShowToast(false),
    displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    handleClose = () => {
      setEmote(null);
      setName("");
    },
    handleFileChange = (e) => {
      const file = e.target.files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!file) {
        handleClose();
        return;
      }

      if (!validImageTypes.includes(file.type)) {
        displayToast("Error: select a valid image file (JPG, PNG, or GIF).");
        handleClose();
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width > 36 || img.height > 36) {
          displayToast("Error: image resolution cannot exceed 36x36 pixels.");
          setEmote(null);
        } else {
          setEmote(file);
        }
      };
      img.src = URL.createObjectURL(file);
      setName(file.name.replace(/\.[^/.]+$/, ""));
    },
    handleSubmit = async () => {
      setLoading(true);
      const response = await EmoteManager.Add(emote, name);
      setLoading(false);
      if (!response) {
        displayToast("Error: Could not add emote.");
        return;
      }

      props.setEmotes((emotes) => emotes.concat(response));
      handleClose();
      props.close();
    };

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>Add new emote</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Emote name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />
        <Button
          component="label"
          sx={{ width: "100%" }}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file {emote?.name && `(${emote.name})`}
          <VisuallyHiddenInput accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} type="file" />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Button onClick={handleSubmit} disabled={!emote || !name}>
            Add
          </Button>
        )}
      </DialogActions>
      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
        <Alert severity={toastMessage.includes("Error") ? "error" : "success"} variant="filled" p={2}>
          <Typography variant="body2">{toastMessage}</Typography>
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddEmoteDialog;
