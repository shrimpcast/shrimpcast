import { Box, Button, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import TokenManager from "../../managers/TokenManager";
import Grid from "@mui/material/Unstable_Grid2";
import Actions from "./Actions/Actions";
import ColourPicker from "../others/ColourPicker";
import ChatActionsManager from "../../managers/ChatActionsManager";
import { OpenInNew } from "@mui/icons-material";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

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
    width: `calc(100% - ${isAdmin ? "34px" : "68px"})`,
    textTransform: "none",
  }),
  ButtonTextSx = {
    paddingLeft: "5px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    marginTop: "2.5px",
  };

const SiteTop = (props) => {
  const {
      isAdmin,
      isMod,
      isGolden,
      signalR,
      userDisplayColor,
      colours,
      useFullChatMode,
      setFullChatMode,
      chatName,
      setChatName,
    } = props,
    [newName, setNewName] = useState(chatName),
    [editMode, setEditMode] = useState(false),
    [loading, setLoading] = useState(false),
    submitEditMode = async () => {
      let trimmedName = newName.trim();
      if (!trimmedName || trimmedName === chatName) {
        return;
      }
      setLoading(true);
      let changedName = await TokenManager.ChangeName(signalR, trimmedName);
      setLoading(false);

      if (changedName !== trimmedName) {
        return;
      }

      setChatName(changedName);
      setNewName(changedName);
      setEditMode(false);
    },
    closeEditMode = () => {
      setNewName(chatName);
      setEditMode(false);
    },
    changeInput = (e) => setNewName(e.target.value),
    handleKeys = async (e) => {
      if (e.key === "Enter") await submitEditMode();
      else if (e.key === "Escape") closeEditMode();
    },
    toggleFullChatMode = () => setFullChatMode((chatMode) => !chatMode);

  return (
    <Box sx={SiteTopSx}>
      <Actions {...props} />
      <Grid
        container
        xs={12}
        md={useFullChatMode ? 12 : 4}
        lg={useFullChatMode ? 12 : 3}
        xl={useFullChatMode ? 12 : 2}
        marginLeft={StatusSx}
      >
        {!editMode ? (
          <>
            <Tooltip title={`Pop ${useFullChatMode ? "in" : "out"} chat`}>
              <IconButton
                type="button"
                size="small"
                sx={{ backgroundColor: "primary.700", borderRadius: "0px", color: "primary.500" }}
                onClick={toggleFullChatMode}
              >
                {useFullChatMode ? <CloseFullscreenIcon /> : <OpenInNew />}
              </IconButton>
            </Tooltip>
            <Button
              onClick={() => setEditMode(true)}
              variant="contained"
              endIcon={<EditIcon />}
              size="small"
              sx={ButtonSx(isAdmin || (isMod && !isGolden))}
            >
              <Box sx={ButtonTextSx}>{chatName}</Box>
            </Button>
            {((!isAdmin && !isMod) || (isMod && isGolden)) && (
              <ColourPicker
                userDisplayColor={userDisplayColor}
                colours={colours}
                executeCallback={async (nameColourId) =>
                  await ChatActionsManager.ChangeColour(props.signalR, nameColourId)
                }
              />
            )}
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
                defaultValue={chatName}
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
