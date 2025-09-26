import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Avatar, Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import React from "react";

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
  EmoteSx = {
    borderRadius: "0px",
    width: "30px",
    height: "30px",
  };

const EmoteSection = ({ text, emotes, emoteClick }) => (
  <>
    <Typography variant="overline" sx={{ display: "block", pl: "8px", pb: "2px" }}>
      {text}
      <Divider sx={{ mr: 2 }} />
    </Typography>
    {emotes.map((emote) => (
      <IconButton onClick={() => emoteClick(emote.name)} key={emote.name}>
        <Avatar alt={emote.alt} sx={EmoteSx} src={emote.url} />
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
