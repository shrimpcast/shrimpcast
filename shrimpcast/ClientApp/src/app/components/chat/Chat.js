import { Box } from "@mui/material";
import React, { useState } from "react";
import ConnectedUsersCount from "./ConnectedUsersCount";
import RenderChatMessages from "./RenderChatMessages";
import ChatTextField from "./ChatTextField";
import ActivePoll from "./ActivePoll";
import ActiveBingo from "./ActiveBingo";

const ChatSx = {
  height: "100%",
  position: "relative",
};

const Chat = (props) => {
  const [autoScroll, toggleAutoScroll] = useState(true),
    [nameSuggestions, setNameSuggestions] = useState([]),
    [bingoButtonExpanded, setBingoButtonExpanded] = useState(true);

  return (
    <Box sx={ChatSx}>
      <ConnectedUsersCount {...props} />
      <ActivePoll {...props} />
      <RenderChatMessages
        autoScroll={autoScroll}
        setNameSuggestions={setNameSuggestions}
        bingoButtonExpanded={bingoButtonExpanded}
        {...props}
      />
      <ActiveBingo
        {...props}
        bingoButtonExpanded={bingoButtonExpanded}
        setBingoButtonExpanded={setBingoButtonExpanded}
      />
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
