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
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K",
  LoaderFallbackBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIoUExURQAAAPRbXO9UVe5TVP9ra/FWV+1RUu5SU/BVVvJYWPJYWe9TVPBUVd88Pu5SU/JYWfdfX/pkZP1nZ/5pav9ra/9ra/9ra/9ra/9ra/9ra/9ra+lLTe5SU/JYWPdgYPxnZ/9ra/9ra/9ra/9ra/9ra+5RUu9UVfVdXf9ra/9ra/9ra+5SU/BVVv9ra/9ra+5SU/BVVv9ra/9ra/BUVe9TVO5TVPNZWu5SU+9UVfJYWe5SU+5TVO9TVO5SU/FWV+5SU+5SU+5SU+5SU/9qav9ra/5qa/xnZ/xnaPZhY/NcXvJZW/JZWvNZWvRbXPZeX/pjY/1oaPhhYv5qavlkZvBYXOtSVexRU+1RU+5RU+5SU/BVVvVdXfxmZvpkZP1pafBaXulPVOtQUvBUVf5paftmZ+tTWehOUv1naPhgYOlRV+lOUvJYWfNaW+dNUvtlZeVLUflkZeVNU+tPUu5RUu5QUe5YXOZLUeppa+psbuxtcOxpbPpkZeZOVepPUutoatzI0OLU3+t+g+5RUet+guXX5ObQ3O1oa/VgYuRLUtzK0uDp9eXZ5uXZ5eTu/OXV4exrbvdfX+h4e9zN1eDp9uTt/OXX4+t7f+xVW+ZMUeXd6uTt+/liYudMUdzR2uHo9eTs+uXb6PNaWud7ftzS2+Xd6dzP2OHp9uXb5+Hq9+t6f+XW4+pqbNvM1Oxsb+tmadzFzeLR3OXU4ObN2O1nautmaOtpa+1maP///y2Q4fkAAABDdFJOUwAAAAAAAAAAAAAAAAACKm6v2/T+/fLZrGsoAgE3mOD8/N+WNgEZiuvqiBg1w8EzQdrYP9oZwwGK6wKYKuBu/K/b9P5sgz6/AAAAAWJLR0S33QA7ZwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+oFGwMiDna/GNQAAAHaSURBVDjLY2AAAUYmJmZePn4BQSFhEVExcQlJKRYgYIADVjZ2aRlZOXlnFxdXFyBQUFRSVkFSwcHJrqqm7ubi7uHp5e3j6+cf4OKioakFV8HBwaatExgUHBIaFh4RCQJR0TEuLrp6UBWsXGz6BrFx8QmJkQiQ5JfsYmgEVsHIxq5t7J+SmhYeiQJ80l0MwWYwcZuYZqRkZkWig+x0F12gOxh4zMxz3FNzIzGBT7KLpgoLA7OMRV58fjgWBZF+LhrKLAyWVr4FhUVggeISiERJMdSlMS5KUgzWNv6lZRCB8gqIusoqqBHRLoqSDLZ21TW1YPG6+obGpsjIpuaW1jaIGVEBChIM9r7tHWFgBeWdXd2NJSXNPb19/U0QI/xdxBkcJsTnQ3jFEydN7m5s7pkydVox3JliDI6B02dEIlTMnDlr6rQSmD98XUQZnGanzoHxSybOnTd/AUI+cqGLCIqC4kWL581f0tiEogDZikVLly1YPqsboQJkBcKRkYuWrpg6beWqKd2NkUiOhHuzafWayUD3laxc1duytgThTURArVu/AeS+kpUbN21GCiikoN6yFSxeXLUNOaiRIwsaPk0okUUwugkmGIJJjmCiJZjsCWccwlmPcObFm/0B3n4vFzGWRGoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDUtMjdUMDM6MzQ6MDQrMDA6MDCwrlfcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTA1LTI3VDAzOjM0OjA0KzAwOjAwwfPvYAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wNS0yN1QwMzozNDoxNCswMDowMFpMziEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC";

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
    { isAdmin, isMod, isGolden, maxLengthTruncation, userColorDisplay, emotes, enabledSources, urlRegex, chatRegex } =
      props,
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
    replyToUser = () => {
      const event = new CustomEvent("userReply", {
        detail: { content: ` @${props.sentBy} ` },
      });
      document.dispatchEvent(event);
    },
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
              <Tooltip title="Remove message">
                <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                  <DeleteIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
              {showPromptDialog && (
                <ConfirmDialog title="Remove message?" confirm={removeMessage} cancel={closeConfirmPrompt} />
              )}
            </>
          )}
        </Box>
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
