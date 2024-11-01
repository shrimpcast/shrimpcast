import { Box, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SystemMessage from "./MessageTypes/SystemMessage";
import MessageManager from "../../managers/MessageManager";
import UserMessage from "./MessageTypes/UserMessage";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SignalRManager from "../../managers/SignalRManager";
import LocalStorageManager from "../../managers/LocalStorageManager";
import ChatActionsManager from "../../managers/ChatActionsManager";

const ChatMessagesSx = (activePoll, activeBingo, bingoButtonExpanded, showGoldenPassButton) => ({
    width: "100%",
    height: `calc(100% - 56px - 28px${activePoll ? " - 35px" : ""}${
      activeBingo ? ` - ${bingoButtonExpanded ? 35 : 10}px` : ""
    }${showGoldenPassButton ? " - 20px" : ""})`,
    overflowY: "scroll",
  }),
  Loader = {
    width: "50px",
    top: "50%",
    left: "50%",
    position: "relative",
    transform: "translate(-50%, -50%)",
    webkitTransform: "translate(-50%, -50%);",
  },
  NewMessagesToastSx = {
    borderRadius: "2.5px",
    position: "sticky",
    width: "100%",
    textAlign: "center",
    maxHeight: "28px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    bottom: "0",
  };

const RenderChatMessages = (props) => {
  const [messages, setMessages] = useState([]),
    [pendingMessages, setPendingMessages] = useState(0),
    [loading, setLoading] = useState(true),
    { signalR, configuration, bingoButtonExpanded, isAdmin, isGolden, goldenPassExpanded } = props,
    scrollReference = useRef(),
    scrollToBottom = () => {
      scrollReference.current.scrollIntoView();
      setPendingMessages(0);
    },
    removeMessageHandler = () => signalR.off(SignalRManager.events.messageReceived),
    addNewMessageHandler = () =>
      signalR.on(SignalRManager.events.messageReceived, (message) => {
        setMessages((existingMessages) => {
          if (ChatActionsManager.IsIgnored(message.sessionId, null, message.isAdmin || message.isMod)) {
            return existingMessages;
          }

          let messageList = existingMessages;
          if (message.messageType === "MessageRemoved") {
            let index = messageList.findIndex((m) => m.messageId === message.messageId);
            messageList.splice(index, 1);
          }

          const isBannedType = message.messageType === "UserBanned",
            isNameChangedType = message.messageType === "NameChange",
            isNameColourChangedType = message.messageType === "UserColourChange";
          if (isBannedType || isNameChangedType || isNameColourChangedType) {
            messageList
              .filter((m) => m.sessionId === message.sessionId)
              .forEach((m) => {
                if (isBannedType) {
                  m.hidden = true;
                }
                if (isNameChangedType) {
                  m.sentBy = message.sentBy;
                }
                if (isNameColourChangedType) {
                  const { content } = message,
                    isModAdded = content === "ModAdded",
                    isModRemoved = content === "ModRemoved",
                    isGoldenAdded = content === "GoldenAdded";

                  if (isModAdded) m.isMod = true;
                  else if (isModRemoved) m.isMod = false;
                  else if (isGoldenAdded) m.isGolden = true;
                  else m.userColorDisplay = content;
                }
              });
          }

          if (message.content && !isNameColourChangedType) {
            message.useTransition = true;
            messageList = messageList.concat(message);
          } else {
            messageList = messageList.concat({ hidden: true });
          }

          /**
           * Clean excess messages
           */
          const maxItems = configuration.maxMessagesToShow;
          if (messageList.length > maxItems) {
            const excessItemsCount = messageList.length - maxItems;
            messageList.splice(0, excessItemsCount);
          }

          return messageList;
        });
      }),
    updateNameSuggestions = () =>
      props.setNameSuggestions((existingSuggestions) => {
        const newSuggestions = [...new Set(messages.map((message) => message.sentBy).filter(Boolean))];
        if (existingSuggestions.length !== newSuggestions.length) return newSuggestions;
        for (let i = 0; i < existingSuggestions.length; i++) {
          if (existingSuggestions[i] !== newSuggestions[i]) return newSuggestions;
        }
        return existingSuggestions;
      });

  /** Get the initial messages */
  useEffect(() => {
    async function getMessages(abortControllerSignal) {
      if (!loading) return;
      let existingMessages = await MessageManager.GetExistingMessages(abortControllerSignal);
      if (abortControllerSignal.aborted) return;
      const ignoredUsers = LocalStorageManager.getIgnoredUsers().map((iu) => iu.sessionId);
      existingMessages = existingMessages.filter(
        (em) => em.isAdmin || em.isMod || !ignoredUsers.includes(em.sessionId)
      );
      existingMessages = existingMessages.reverse();
      setMessages(existingMessages);
      setLoading(false);
    }

    const abortController = new AbortController();
    getMessages(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Add the handlers */
  useEffect(() => {
    addNewMessageHandler();
    return () => removeMessageHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.maxMessagesToShow]);

  /** Scroll listeners */
  useEffect(() => {
    const lastMessage = messages[messages.length ? messages.length - 1 : 0]?.content;
    if (!lastMessage) return;
    if (props.autoScroll) scrollToBottom();
    else setPendingMessages((state) => state + 1);
    updateNameSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Box
      sx={ChatMessagesSx(
        configuration.showPoll,
        configuration.showBingo,
        bingoButtonExpanded,
        !isAdmin && !isGolden && configuration.showGoldenPassButton && goldenPassExpanded
      )}
    >
      {loading && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      {messages.map(
        (message) =>
          !message.hidden &&
          message.content &&
          (message.messageType !== "UserMessage" ? (
            <SystemMessage key={message.messageId} siteAdmin={props.isAdmin} signalR={signalR} {...message} />
          ) : (
            <UserMessage
              key={message.messageId}
              siteAdmin={props.isAdmin}
              siteMod={props.isMod}
              emotes={props.emotes}
              signalR={signalR}
              enableChristmasTheme={configuration.enableChristmasTheme}
              enableHalloweenTheme={configuration.enableHalloweenTheme}
              userSessionId={props.sessionId}
              maxLengthTruncation={configuration.maxLengthTruncation}
              {...message}
            />
          ))
      )}
      <Box ref={scrollReference}></Box>
      {pendingMessages > 0 && (
        <Button
          sx={NewMessagesToastSx}
          variant="contained"
          color="success"
          onClick={scrollToBottom}
          endIcon={<ArrowDownwardIcon />}
        >
          {pendingMessages} new messages
        </Button>
      )}
    </Box>
  );
};

export default RenderChatMessages;
