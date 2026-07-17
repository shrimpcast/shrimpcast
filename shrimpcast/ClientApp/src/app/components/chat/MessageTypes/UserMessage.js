import { Box, IconButton, Typography, Link as DefaultLink, Tooltip } from "@mui/material";
import React, { useState } from "react";
import reactStringReplace from "react-string-replace";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import ManageUserDialog from "../ManageUserDialog";
import ConfirmDialog from "../../others/ConfirmDialog";
import MessageWrapper from "./MessageWrapper";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ShieldIcon from "@mui/icons-material/Shield";
import KeyframesManager from "../../../managers/KeyframesManager";
import { Link as RouterLink } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplyIcon from "@mui/icons-material/Reply";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import UserLabel from "./UserLabel";
import MessageIcon from "@mui/icons-material/Message";
import LabelIcon from "@mui/icons-material/Label";

const WrapperTextBoxSx = (color) => ({
    margin: "5px 0",
    padding: "8px 10px",
    wordWrap: "break-word",
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.3)",
    transition: "background-color 0.15s linear",
    borderLeft: `3px solid ${color}`,
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.08)",
      borderLeftColor: "rgba(255,255,255,0.3)",
    },
  }),
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
  BadgeSx = {
    fontSize: "13px",
    position: "relative",
    top: "1px",
    mr: "1px",
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
  ExpandButtonSx = {
    color: "secondary.500",
    ml: "2.5px",
    fontWeight: "bold",
  },
  HoverUnderlineSx = {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  SourceLinkSx = {
    ml: "2.5px",
    mr: "2.5px",
    fontWeight: "bold",
    fontSize: "15px",
    color: "secondary.main",
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    ...HoverUnderlineSx,
  },
  GoldenPassGlow = (color) => ({
    color,
    animation: `${KeyframesManager.getGoldenGlowKeyframes(color)} 1s infinite alternate`,
  }),
  LoaderBase64 =
    "data:image/gif;base64,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",
  LoaderFallbackBase64 =
    "data:image/png;base64,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";

const verboseHMS = (input) => {
  const diff = Math.floor((Date.now() - new Date(input).getTime()) / 1000);
  if (diff <= 0) return "Just now";

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (minutes < 1) return `${seconds} seconds ago`;
  if (hours < 1) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
};

const EmoteWithFallback = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false),
    [error, setError] = useState(false);

  return (
    <>
      {!loaded && !error && <img src={LoaderBase64} className="emote noselect" alt="" title={`Loading ${alt}`} />}
      {(!loaded && !error) || loaded ? (
        <img
          alt={alt}
          src={src}
          title={alt}
          className="emote"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          hidden={!loaded}
        />
      ) : (
        <img src={LoaderFallbackBase64} className="emote noselect" alt="" title={`Could not load ${alt}`} />
      )}
    </>
  );
};

const UserMessage = React.memo((props) => {
  const [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    [externalOpenUserDialog, setExternalOpenUserDialog] = useState(false),
    openExternalUserDialog = () => setExternalOpenUserDialog(true),
    closeExternalUserDialog = () => setExternalOpenUserDialog(false),
    {
      isAdmin,
      isMod,
      isGolden,
      maxLengthTruncation,
      userColorDisplay,
      emotes,
      enabledSources,
      urlRegex,
      chatRegex,
      showUserLabels,
      userLabel,
    } = props,
    removeMessage = async () => {
      const response = await ChatActionsManager.RemoveMessage(props.signalR, props.messageId);
      if (response) closeConfirmPrompt();
    },
    [isMiniminized, setMinimized] = useState(!isAdmin),
    openMinimized = () => setMinimized(false),
    content =
      props.content.length > maxLengthTruncation && isMiniminized
        ? props.content.substring(0, maxLengthTruncation) + "..."
        : props.content,
    getEmote = (emoteName) => emotes.find((emote) => emote.name === emoteName),
    getSource = (sourceName) => enabledSources.find((eS) => `/${eS.name.toLowerCase()}` === sourceName),
    dispatchTextEvent = (content) => {
      const event = new CustomEvent("userReply", {
        detail: { content: content },
      });
      document.dispatchEvent(event);
    },
    replyToUser = () => dispatchTextEvent(` @${props.sentBy} `),
    sendDirectMessage = () => dispatchTextEvent(`!ping ${props.sessionId} `),
    setUserLabel = () => dispatchTextEvent(`!userlabel ${props.sessionId} `),
    [agoText, setAgoText] = useState("");

  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box
        className="wrapper-comment"
        sx={WrapperTextBoxSx(isAdmin ? "#b23c17" : isMod ? "#66ccff" : userColorDisplay)}
      >
        <Box className="wrapper-overlay" sx={OverlaySx}>
          <Tooltip title="Reply">
            <IconButton sx={OverlayButtonSx} onClick={replyToUser}>
              <ReplyIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Tooltip>
          <ManageUserDialog
            OverlayButtonSx={OverlayButtonSx}
            externalOpenUserDialog={externalOpenUserDialog}
            closeExternalUserDialog={closeExternalUserDialog}
            skipUserDialogButton={true}
            {...props}
          />
          {props.siteAdmin && (
            <>
              <Tooltip title="Send DM">
                <IconButton sx={OverlayButtonSx} onClick={sendDirectMessage}>
                  <MessageIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Set label">
                <IconButton sx={OverlayButtonSx} onClick={setUserLabel}>
                  <LabelIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          {(props.siteAdmin || (props.siteMod && !isAdmin && !isMod)) && (
            <>
              <Tooltip title="Remove">
                <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                  <DeleteIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
              {showPromptDialog && (
                <ConfirmDialog
                  title="Are you sure you want to delete this post?"
                  confirm={removeMessage}
                  cancel={closeConfirmPrompt}
                />
              )}
            </>
          )}
        </Box>
        {showUserLabels && (
          <UserLabel
            color={isAdmin ? "#b23c17" : isMod ? "#66ccff" : userColorDisplay}
            label={userLabel}
            isNormalUser={!isGolden && !isAdmin && !isMod}
          />
        )}
        <Box display="inline-block">
          <Typography
            sx={[TextSx(userColorDisplay, true), HoverUnderlineSx, isGolden ? GoldenPassGlow(userColorDisplay) : null]}
            className={`${
              props.enableChristmasTheme ? "santa-hat" : props.enableHalloweenTheme ? "halloween-hat" : null
            } ${isAdmin ? "admin-glow" : isMod ? "mod-glow" : isGolden ? "gold-pass" : null}`}
            onClick={openExternalUserDialog}
          >
            {isAdmin ? (
              <LocalPoliceIcon sx={BadgeSx} />
            ) : isMod ? (
              <ShieldIcon sx={BadgeSx} />
            ) : isGolden ? (
              <WorkspacePremiumIcon sx={BadgeSx} />
            ) : null}

            <Tooltip
              placement="bottom-start"
              enterDelay={0}
              leaveDelay={0}
              arrow
              title={agoText}
              onOpen={() =>
                setAgoText(
                  `${isAdmin ? "[ADMIN] - " : isMod ? "[MOD] - " : isGolden ? "[VIP] - " : ""}${verboseHMS(props.createdAt)}`,
                )
              }
            >
              <span>{props.sentBy}</span>
            </Tooltip>
          </Typography>
        </Box>
        {": "}
        <Typography component="span" sx={TextSx(null, false, content.startsWith(">"))}>
          {reactStringReplace(content, chatRegex, (match, i) =>
            getEmote(match.toLowerCase()) ? (
              <EmoteWithFallback key={i} alt={match.toLowerCase()} src={getEmote(match.toLowerCase()).url} />
            ) : match.toLowerCase().match(urlRegex) ? (
              <DefaultLink key={i} href={match} target="_blank">
                {match}
              </DefaultLink>
            ) : getSource(match.trim().toLowerCase()) ? (
              <RouterLink key={i} to={match.trim().toLowerCase()} style={{ textDecoration: "none" }}>
                <Typography sx={SourceLinkSx}>
                  <PlayArrowIcon sx={{ fontSize: "10px", color: "secondary.main" }} />
                  {match.trim().toLowerCase()}
                </Typography>
              </RouterLink>
            ) : (
              <Typography key={i} component="span" sx={HighlightSx}>
                {match}
              </Typography>
            ),
          )}
          {isMiniminized && props.content.length > maxLengthTruncation && (
            <DefaultLink component="button" sx={ExpandButtonSx} title="Click to expand" onClick={openMinimized}>
              [+]
            </DefaultLink>
          )}
        </Typography>
      </Box>
    </MessageWrapper>
  );
});

export default UserMessage;
