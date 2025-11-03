import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";

const GenericAddTextItemDialog = (props) => {
  const {
      setAddDialogOpened,
      gad_title,
      gad_description,
      gad_handleSubmit,
      signalR,
      setItems,
      defaultValue,
      editMode,
      customCallback,
      allowEmptyEdit,
      isNumeric,
      probe,
    } = props,
    [loading, setLoading] = useState(false),
    [passedProbe, setPassedProbe] = useState(false),
    [probeReturnData, setProbeReturnData] = useState({}),
    [item, setItem] = useState(defaultValue),
    closeDialog = () => {
      setItem("");
      setAddDialogOpened(false);
      setPassedProbe(false);
      setProbeReturnData({});
    },
    submit = async () => {
      if (customCallback) {
        customCallback(item, probeReturnData);
        closeDialog();
        return;
      }
      setLoading(true);
      const response = await gad_handleSubmit(signalR, item);
      setLoading(false);
      if (!response) return;
      setItems((item) => item.concat(response));
      closeDialog();
    };

  return (
    <Dialog open={true} maxWidth={"sm"} fullWidth onClose={closeDialog}>
      <DialogTitle>{gad_title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={gad_description}
          value={item ?? ""}
          onChange={(e) => {
            const { value } = e.target,
              isEmpty = value === "";
            setItem(isEmpty ? null : isNumeric ? +value : value);
            probe && setPassedProbe(false);
          }}
          fullWidth
          size="small"
          type={isNumeric ? "number" : "text"}
        />
        {probe && probe.enableProbeCondition(item) && (
          <probe.probe
            value={item}
            onSuccess={(data) => {
              setProbeReturnData(data);
              setPassedProbe(true);
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Button onClick={submit} disabled={(probe && !passedProbe) || (!item && !allowEmptyEdit)}>
            {editMode ? "Edit" : "Add"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenericAddTextItemDialog;
