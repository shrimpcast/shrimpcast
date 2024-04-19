import { Box } from "@mui/material";
import React, { useState } from "react";
import ConnectedUsersCount from "./ConnectedUsersCount";
import RenderChatMessages from "./RenderChatMessages";
import ChatTextField from "./ChatTextField";
import ActivePoll from "./ActivePoll";

const ChatSx = {
  height: "100%",
  position: "relative",
};

const Chat = (props) => {
  const [autoScroll, toggleAutoScroll] = useState(true),
    [nameSuggestions, setNameSuggestions] = useState([]);

  return (
    <Box sx={ChatSx}>
      <ConnectedUsersCount {...props} />
      <ActivePoll {...props} />
      <RenderChatMessages autoScroll={autoScroll} setNameSuggestions={setNameSuggestions} {...props} />
      <ChatTextField
        autoScroll={autoScroll}
        toggleAutoScroll={toggleAutoScroll}
        signalR={props.signalR}
        nameSuggestions={nameSuggestions}
        {...props}
      />
    </Box>
  );
};

export default Chat;
