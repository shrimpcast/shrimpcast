import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PollManager from "../../managers/PollManager";
import RenderPollOptions from "./RenderPollOptions";
import ConfirmDialog from "../others/ConfirmDialog";

const PollSx = {
    marginLeft: 1,
    marginRight: 1,
    paddingBottom: 2,
  },
  AddOptionButtonSx = {
    position: "relative",
    left: "2px",
    color: "secondary",
    backgroundColor: "secondary.light",
    borderRadius: "0px",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  TitleBoxSx = {
    display: "flex",
    width: "100%",
    marginTop: 1,
  };

const Poll = (props) => {
  const config = props.configuration,
    [newPollOption, setNewPollOption] = useState(""),
    [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    [selectedOption, setSelectedOption] = useState(null),
    submitOption = async () => {
      const pollOption = newPollOption.trim();
      if (!pollOption) return;

      const response = await PollManager.NewOption(props.signalR, pollOption);
      if (response > 0) setSelectedOption(response);
      if (response !== undefined) setNewPollOption("");
    },
    changeInput = (e) => setNewPollOption(e.target.value),
    handleKeys = async (e) => e.key === "Enter" && (await submitOption()),
    removeAllOptions = async () => {
      const response = await PollManager.RemoveOption(props.signalR, 0);
      if (response) closeConfirmPrompt();
    };

  useEffect(() => {
    setSelectedOption(props.pollOptionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.poll.options]);

  return (
    <Box sx={PollSx}>
      <Box sx={TitleBoxSx}>
        <Typography sx={{ wordBreak: "break-word" }} color="white" variant="h6">
          {config.pollTitle}
        </Typography>
        {props.isAdmin && (
          <>
            <Button onClick={openConfirmPrompt} size="small" color="error" sx={{ marginLeft: "auto" }}>
              Reset
            </Button>
            {showPromptDialog && (
              <ConfirmDialog title="Remove all options?" confirm={removeAllOptions} cancel={closeConfirmPrompt} />
            )}
          </>
        )}
      </Box>
      <RenderPollOptions selectedOption={selectedOption} setSelectedOption={setSelectedOption} {...props} />
      {(props.isAdmin || (config.acceptNewOptions && !selectedOption)) && (
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={submitOption} sx={AddOptionButtonSx} edge="end">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            maxLength: 250,
          }}
          type="text"
          label={"Add option"}
          color="secondary"
          fullWidth
          size="small"
          onInput={changeInput}
          onKeyDown={handleKeys}
          value={newPollOption}
          sx={{ marginTop: "10px" }}
        />
      )}
    </Box>
  );
};

export default Poll;
