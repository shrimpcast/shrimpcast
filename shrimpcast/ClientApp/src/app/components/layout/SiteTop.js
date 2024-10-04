import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import TokenManager from "../../managers/TokenManager";
import LocalStorageManager from "../../managers/LocalStorageManager";
import Grid from "@mui/material/Unstable_Grid2";
import Colours from "../chat/Colours/Colours";
import Actions from "./Actions/Actions";

const SiteTopSx = {
    width: "100%",
    height: 35,
    backgroundColor: "primary.800",
    zIndex: 1,
    display: "flex",
  },
  StatusSx = {
    marginLeft: "auto",
  },
  ButtonSx = (isAdmin) => ({
    height: "35px",
    borderRadius: "0px",
    width: `calc(100% - ${isAdmin ? "0px" : "34px"})`,
    textTransform: "none",
  }),
  ButtonTextSx = {
    paddingLeft: "5px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    marginTop: "2.5px",
  };

const SiteTop = (props) => {
  const { isAdmin, isMod, isGolden, signalR } = props,
    [registeredName, setRegisteredName] = useState(props.name),
    [newName, setNewName] = useState(registeredName),
    [editMode, setEditMode] = useState(false),
    [loading, setLoading] = useState(false),
    submitEditMode = async () => {
      let trimmedName = newName.trim();
      if (!trimmedName || trimmedName === registeredName) {
        return;
      }
      setLoading(true);
      let changedName = await TokenManager.ChangeName(signalR, trimmedName);
      setLoading(false);

      if (changedName !== trimmedName) {
        return;
      }

      LocalStorageManager.saveName(changedName);
      setRegisteredName(changedName);
      setNewName(changedName);
      setEditMode(false);
    },
    closeEditMode = () => {
      setNewName(registeredName);
      setEditMode(false);
    },
    changeInput = (e) => setNewName(e.target.value),
    handleKeys = async (e) => {
      if (e.key === "Enter") await submitEditMode();
      else if (e.key === "Escape") closeEditMode();
    };

  return (
    <Box sx={SiteTopSx}>
      <Actions {...props} />
      <Grid container xs={12} md={4} lg={3} xl={2} marginLeft={StatusSx}>
        {!editMode ? (
          <>
            <Button
              onClick={() => setEditMode(true)}
              variant="contained"
              endIcon={<EditIcon />}
              size="small"
              sx={ButtonSx(isAdmin || isMod || isGolden)}
            >
              <Box sx={ButtonTextSx}>{registeredName}</Box>
            </Button>
            {!isAdmin && !isMod && !isGolden && <Colours {...props} />}
          </>
        ) : (
          <>
            <Box width="calc(100% - 68px)">
              <TextField
                hiddenLabel
                size="small"
                variant="filled"
                inputProps={{
                  style: {
                    height: "17px",
                  },
                  maxLength: 32,
                }}
                onInput={changeInput}
                onKeyDown={handleKeys}
                defaultValue={registeredName}
                disabled={loading}
                fullWidth
              />
            </Box>
            <IconButton
              disabled={loading}
              onClick={submitEditMode}
              type="button"
              size="small"
              sx={{ borderRadius: "0px" }}
            >
              {loading ? <CircularProgress color="secondary" size={12} /> : <DoneIcon />}
            </IconButton>
            <IconButton
              disabled={loading}
              onClick={closeEditMode}
              type="button"
              size="small"
              sx={{ borderRadius: "0px" }}
            >
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default SiteTop;
