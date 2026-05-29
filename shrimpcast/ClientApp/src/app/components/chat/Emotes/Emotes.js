import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Avatar, Box, Divider, IconButton, Paper, Typography, Skeleton } from "@mui/material";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import React, { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";

const EmotesWrapperSx = {
    position: "absolute",
    bottom: "65px",
    width: "100%",
    padding: "2px",
    paddingLeft: "7.5px",
    paddingTop: "5px",
    zIndex: 1,
  },
  EmotesSx = {
    marginTop: "5px",
    marginBottom: "5px",
    maxHeight: "200px",
    overflowY: "scroll",
  },
  EmoteSx = (show) => ({
    width: "30px",
    height: "30px",
    display: show ? "flex" : "none",
    backgroundColor: "transparent !important",
  });

const AvatarWithFallback = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false),
    [error, setError] = useState(false),
    size = 30;

  return (
    <>
      {!loaded && !error && <Skeleton variant="circular" width={size} height={size} />}

      <Avatar
        variant="rounded"
        src={src}
        alt={alt}
        title={error ? `Could not load ${alt}` : alt}
        sx={EmoteSx(loaded || error)}
        imgProps={{
          onLoad: () => setLoaded(true),
          onError: () => setError(true),
        }}
      >
        <ErrorIcon sx={{ color: "red" }} />
      </Avatar>
    </>
  );
};

const EmoteSection = ({ text, emotes, emoteClick }) => (
  <>
    <Typography variant="overline" sx={{ display: "block", pl: "8px", pb: "2px" }}>
      {text}
      <Divider sx={{ mr: 2 }} />
    </Typography>
    {emotes.map((emote) => (
      <IconButton onClick={() => emoteClick(emote.name)} key={emote.name}>
        <AvatarWithFallback alt={emote.name} src={emote.url} />
      </IconButton>
    ))}
  </>
);

const Emotes = React.memo((props) => {
  const handleClose = () => props.setEmotes(false),
    { emotes, setMessage } = props,
    recentlyUsedEmotes = LocalStorageManager.getRecentlyUsedEmotes()
      .map((r) => emotes.find((emote) => emote.name === r))
      .filter(Boolean),
    emoteClick = (emote) => {
      setMessage((message) => message + emote);
      const recentlyUsedEmotes = LocalStorageManager.getRecentlyUsedEmotes();
      recentlyUsedEmotes.unshift(emote);
      LocalStorageManager.setRecentlyUsedEmotes([...new Set(recentlyUsedEmotes)].slice(0, 12));
    };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper sx={EmotesWrapperSx} elevation={2}>
        <Box sx={EmotesSx} className="scrollbar-custom">
          {Boolean(recentlyUsedEmotes.length) && (
            <EmoteSection text={"Recently used"} emotes={recentlyUsedEmotes} emoteClick={emoteClick} />
          )}
          <EmoteSection text={"All emotes"} emotes={emotes} emoteClick={emoteClick} />
        </Box>
      </Paper>
    </ClickAwayListener>
  );
});

export default Emotes;
