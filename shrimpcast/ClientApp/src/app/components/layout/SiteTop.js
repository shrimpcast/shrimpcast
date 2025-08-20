import { Box, Button, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRef, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import TokenManager from "../../managers/TokenManager";
import Grid from "@mui/material/Unstable_Grid2";
import Actions from "./Actions/Actions";
import ColourPicker from "../others/ColourPicker";
import ChatActionsManager from "../../managers/ChatActionsManager";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import CommentIcon from "@mui/icons-material/Comment";

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
  ButtonSx = (isAdmin, poppedOutChat) => ({
    height: "35px",
    borderRadius: "0px",
    width: `calc(100% - ${isAdmin ? "34px" : "68px"}${poppedOutChat ? " + 34px" : ""})`,
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
      poppedOutChat,
    } = props,
    [newName, setNewName] = useState(chatName),
    [editMode, setEditMode] = useState(false),
    [loading, setLoading] = useState(false),
    containerRef = useRef(null),
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
    toggleFullChatMode = () => {
      if (!useFullChatMode) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = window.screen.height;
        const left = window.screen.width - width;
        window._window = window.open(
          "/chat",
          "Chat",
          `width=${width},height=${height},left=${left},resizable=yes,scrollbars=yes`
        );
      } else {
        window._window?.close();
        window._window = null;
      }
      setFullChatMode((chatMode) => !chatMode);
    };

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
        ref={containerRef}
      >
        {!editMode ? (
          <>
            {!poppedOutChat && (
              <Tooltip title={`Pop-${useFullChatMode ? "in" : "out"} chat`}>
                <IconButton
                  type="button"
                  size="small"
                  sx={{ backgroundColor: "primary.700", borderRadius: "0px", color: "primary.200" }}
                  onClick={toggleFullChatMode}
                >
                  {useFullChatMode ? <CommentIcon /> : <CommentsDisabledIcon />}
                </IconButton>
              </Tooltip>
            )}
            <Button
              onClick={() => setEditMode(true)}
              variant="contained"
              endIcon={<EditIcon />}
              size="small"
              sx={ButtonSx(isAdmin || (isMod && !isGolden), poppedOutChat)}
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
