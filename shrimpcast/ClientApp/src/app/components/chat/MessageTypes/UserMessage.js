import { Box, IconButton, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import reactStringReplace from "react-string-replace";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import ManageUserDialog from "../ManageUserDialog";
import ConfirmDialog from "../../others/ConfirmDialog";
import MessageWrapper from "./MessageWrapper";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ShieldIcon from "@mui/icons-material/Shield";
import KeyframesManager from "../../../managers/KeyframesManager";

const WrapperTextBoxSx = {
    margin: "10px",
    wordWrap: "break-word",
    padding: "2px",
    position: "relative",
    "&:hover": {
      backgroundColor: "primary.800",
    },
  },
  TextSx = (color, force, gt) => ({
    fontWeight: color || force ? "bold" : "none",
    color: color ? color : gt ? "#789922" : "white",
    display: "inline",
    fontSize: "15px",
  }),
  OverlaySx = {
    width: "auto",
    height: "25px",
    position: "absolute",
    right: 0,
    padding: 0,
    borderRadius: "5px",
    display: "flex",
    visibility: "hidden",
    top: "5px",
    zIndex: 2,
  },
  HighlightSx = {
    margin: "2px",
    padding: "2px",
    backgroundColor: "secondary.main",
    color: "black",
    fontSize: "15px",
    borderRadius: "5px",
  },
  VerifiedUserIconSx = {
    fontSize: "13px",
    position: "relative",
    top: "1.2px",
  },
  OverlayButtonSx = {
    color: "white",
    backgroundColor: "primary.500",
    fontSize: "16px",
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    marginRight: "2px",
  },
  GoldenPassGlow = (color) => ({
    color,
    animation: `${KeyframesManager.getGoldenGlowKeyframes(color)} 1s infinite alternate`,
  });

const UserMessage = React.memo((props) => {
  const [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    { isAdmin, isMod, isGolden, maxLengthTruncation, userColorDisplay } = props,
    escapedName = LocalStorageManager.getName().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    // Use lookahead assertion to ensure we're matching the full name
    nameRegex = `@${escapedName}(?:\\s|$|\\.)`,
    emotes = props.emotes.map((emote) => emote.name).join("|"),
    urlRegex = "https?://\\S+",
    regex = new RegExp(`(${nameRegex}|${emotes}|${urlRegex})`, "giu"),
    removeMessage = async () => {
      let resp = await ChatActionsManager.RemoveMessage(props.signalR, props.messageId);
      if (resp) closeConfirmPrompt();
    },
    [isMiniminized, setMinimized] = useState(!isAdmin),
    openMinimized = () => setMinimized(false),
    content =
      props.content.length > maxLengthTruncation && isMiniminized
        ? props.content.substring(0, maxLengthTruncation)
        : props.content,
    getEmote = (emoteName) => props.emotes.find((emote) => emote.name === emoteName);

  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box className="wrapper-comment" sx={WrapperTextBoxSx}>
        <Box className="wrapper-overlay" sx={OverlaySx}>
          <ManageUserDialog OverlayButtonSx={OverlayButtonSx} {...props} />
          {props.siteAdmin && (
            <>
              <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              {showPromptDialog && (
                <ConfirmDialog title="Remove message?" confirm={removeMessage} cancel={closeConfirmPrompt} />
              )}
            </>
          )}
        </Box>
        <Box display="inline-block">
          <Typography
            sx={[TextSx(userColorDisplay, true), isGolden ? GoldenPassGlow(userColorDisplay) : null]}
            className={`${
              props.enableChristmasTheme ? "santa-hat" : props.enableHalloweenTheme ? "halloween-hat" : null
            } ${isAdmin ? "admin-glow" : isMod ? "mod-glow" : null}`}
          >
            {isAdmin ? (
              <VerifiedUserIcon sx={VerifiedUserIconSx} />
            ) : isMod ? (
              <ShieldIcon sx={VerifiedUserIconSx} />
            ) : isGolden ? (
              <WorkspacePremiumIcon sx={VerifiedUserIconSx} />
            ) : null}
            {props.sentBy}
          </Typography>
        </Box>
        {": "}
        <Typography component="span" sx={TextSx(null, false, content.startsWith(">"))}>
          {reactStringReplace(content, regex, (match, i) =>
            getEmote(match.toLowerCase()) ? (
              <img key={i} alt={match.toLowerCase()} className="emote" src={getEmote(match.toLowerCase()).url} />
            ) : match.match(urlRegex) ? (
              <Link key={i} href={match} target="_blank">
                {match}
              </Link>
            ) : (
              <Typography key={i} component="span" sx={HighlightSx}>
                {match}
              </Typography>
            )
          )}
          {isMiniminized && props.content.length > maxLengthTruncation && (
            <Link
              component="button"
              sx={{ color: "secondary.500", ml: "2.5px" }}
              title="Click to expand"
              onClick={openMinimized}
            >
              {" [+]"}
            </Link>
          )}
        </Typography>
      </Box>
    </MessageWrapper>
  );
});

export default UserMessage;
