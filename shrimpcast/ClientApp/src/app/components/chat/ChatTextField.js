import SendIcon from "@mui/icons-material/Send";
import { Box, Checkbox, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import MessageManager from "../../managers/MessageManager";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Emotes from "./Emotes/Emotes";
import AutoComplete from "./AutoComplete";
import WiFiSignalStrength from "./WiFiSignalStrength";

const SendInputSx = {
    width: "100%",
    position: "relative",
  },
  SendTextFieldSx = {
    input: {
      "&::placeholder": {
        opacity: 1,
        color: "secondary.main",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderBottomRightRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
    label: { color: "secondary.main" },
    zIndex: 2,
  },
  ScrollSx = (isChecked) => ({
    position: "absolute",
    top: "1px",
    right: "1px",
    backgroundColor: isChecked ? "secondary.400" : "error.main",
    height: "13.5px",
    borderRadius: "1px",
    borderTopRightRadius: "5px",
  }),
  CheckBoxSx = {
    color: "white",
    "& .MuiSvgIcon-root": { fontSize: 19 },
    p: 0,
    m: 0,
    position: "relative",
    "&.Mui-checked": {
      color: "primary.800",
    },
    left: "3px",
    bottom: "8.5px",
    zIndex: 5,
  },
  LabelSx = (isChecked) => ({
    fontSize: 11.5,
    position: "relative",
    bottom: "8px",
    fontWeight: "bold",
    color: isChecked ? "primary.900" : "white",
    left: "3px",
  });

const ChatTextField = (props) => {
  const [message, setMessage] = useState(""),
    [focused, setFocused] = useState(false),
    [loading, setLoading] = useState(false),
    [showAutocomplete, setShowAutocomplete] = useState(false),
    [autoCompleteIndex, setAutoCompleteIndex] = useState(0),
    { signalR, configuration, isAdmin } = props,
    changeInput = (e) => {
      const target = e.target,
        ne = e.nativeEvent;
      setMessage(target.value);
      if (ne?.data === "@") {
        setAutoCompleteIndex(0);
        setShowAutocomplete(true);
      } else if (ne?.inputType === "deleteContentBackward" && message.charAt(target.selectionStart) === "@") {
        setShowAutocomplete(false);
      }
    },
    submitMessage = async () => {
      setShowAutocomplete(false);
      let value = message.trim();
      if (!value || loading) return;

      setLoading(true);
      const response = await MessageManager.NewMessage(signalR, value);
      setLoading(false);
      if (response) setMessage("");
    },
    handleKeys = async (e) => {
      if (e.key === "Enter") {
        if (!showAutocomplete) await submitMessage();
        else setAutoCompleteIndex(autoCompleteIndex === 0 ? Number.MIN_SAFE_INTEGER : -autoCompleteIndex);
      }
      if (!showAutocomplete) return;
      switch (e.key) {
        case "Escape":
          setShowAutocomplete(false);
          break;
        case "ArrowUp":
          autoCompleteIndex > 0 && setAutoCompleteIndex((index) => index - 1);
          break;
        case "ArrowDown":
          setAutoCompleteIndex((index) => index + 1);
          break;
        default:
          break;
      }
    },
    isDisabled = !configuration.chatEnabled && !isAdmin,
    [emotes, setEmotes] = useState(false),
    setEmotesOpen = () => setEmotes(true),
    toggleAutoScroll = () => props.toggleAutoScroll((state) => !state);

  return (
    <Box sx={SendInputSx}>
      {showAutocomplete && (
        <AutoComplete
          nameSuggestions={props.nameSuggestions}
          setShowAutocomplete={setShowAutocomplete}
          message={message}
          setMessage={setMessage}
          autoCompleteIndex={autoCompleteIndex}
          setAutoCompleteIndex={setAutoCompleteIndex}
        />
      )}
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton disabled={isDisabled || loading} onClick={setEmotesOpen} edge="start" color="secondary">
                <InsertEmoticonIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={16} color="secondary" />
              ) : (
                <IconButton disabled={isDisabled || loading} onClick={submitMessage} edge="end" color="secondary">
                  <SendIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        inputProps={{
          maxLength: 500,
        }}
        InputLabelProps={{
          shrink: focused || message.trim() !== "",
          style: { paddingLeft: "2rem" },
        }}
        type="text"
        autoComplete="off"
        placeholder={isDisabled ? "Chat temporarily disabled" : "Write a message.."}
        color="secondary"
        fullWidth
        sx={SendTextFieldSx}
        onKeyDown={handleKeys}
        onInput={changeInput}
        value={message}
        disabled={isDisabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <WiFiSignalStrength {...props} />
      <Box sx={ScrollSx(props.autoScroll)}>
        <Typography className="noselect" variant="overline" sx={LabelSx(props.autoScroll)}>
          Autoscroll
        </Typography>
        <Checkbox onChange={toggleAutoScroll} defaultChecked sx={CheckBoxSx} />
      </Box>
      {emotes && <Emotes setEmotes={setEmotes} emotes={props.emotes} setMessage={setMessage} />}
    </Box>
  );
};

export default ChatTextField;
