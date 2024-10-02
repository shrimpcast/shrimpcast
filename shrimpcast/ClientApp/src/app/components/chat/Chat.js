import { Box } from "@mui/material";
import React, { useState } from "react";
import ConnectedUsersCount from "./ConnectedUsersCount";
import RenderChatMessages from "./RenderChatMessages";
import ChatTextField from "./ChatTextField";
import ActivePoll from "./ActivePoll";
import ActiveBingo from "./ActiveBingo";
import GoldenPassButton from "./GoldenPass/GoldenPassButton";

const ChatSx = {
  height: "100%",
  position: "relative",
};

const Chat = (props) => {
  const [autoScroll, toggleAutoScroll] = useState(true),
    [nameSuggestions, setNameSuggestions] = useState([]),
    [bingoButtonExpanded, setBingoButtonExpanded] = useState(true),
    [goldenPassExpanded, setGoldenPassExpanded] = useState(true);

  return (
    <Box sx={ChatSx}>
      <ConnectedUsersCount {...props} />
      <ActivePoll {...props} goldenPassExpanded={goldenPassExpanded} />
      <RenderChatMessages
        autoScroll={autoScroll}
        setNameSuggestions={setNameSuggestions}
        bingoButtonExpanded={bingoButtonExpanded}
        goldenPassExpanded={goldenPassExpanded}
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
      <GoldenPassButton
        {...props}
        goldenPassExpanded={goldenPassExpanded}
        setGoldenPassExpanded={setGoldenPassExpanded}
      />
    </Box>
  );
};

export default Chat;
