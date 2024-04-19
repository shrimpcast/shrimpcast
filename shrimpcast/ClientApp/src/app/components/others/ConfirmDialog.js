import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";

const ConfirmDialog = (props) => {
  return (
    <Dialog
      open={true}
      onClose={props.cancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      {props.content && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.content}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={props.cancel}>Cancel</Button>
        {!props.isLoading ? (
          <Button onClick={props.confirm} autoFocus>
            Confirm
          </Button>
        ) : (
          <CircularProgress size={24} />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
