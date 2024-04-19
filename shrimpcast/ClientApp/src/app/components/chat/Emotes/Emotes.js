import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Avatar, Box, IconButton, Paper } from "@mui/material";

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
  };

const Emotes = (props) => {
  const handleClose = () => props.setEmotes(false),
    emoteClick = (emote) => props.setMessage((message) => message + emote);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper sx={EmotesWrapperSx} elevation={2}>
        <Box sx={EmotesSx}>
          {props.emotes.map((emote) => (
            <IconButton onClick={() => emoteClick(emote.name)} key={emote.name}>
              <Avatar alt={emote.alt} sx={{ borderRadius: "0px", width: "30px", height: "30px" }} src={emote.url} />
            </IconButton>
          ))}
        </Box>
      </Paper>
    </ClickAwayListener>
  );
};

export default Emotes;
