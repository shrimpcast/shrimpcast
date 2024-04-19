import { Box, Chip, IconButton, LinearProgress } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PollManager from "../../managers/PollManager";
import ConfirmDialog from "../others/ConfirmDialog";
import { Radio } from "@mui/material";

const PollOptionSx = (selected) => ({
    width: "100%",
    position: "relative",
    marginTop: "10px",
    borderColor: selected ? "#f44336" : "none",
    boxShadow: selected ? "0 0 10px #f44336" : "none",
    "&:hover": {
      borderColor: "#ffc107",
      boxShadow: "0 0 10px #ffc107",
    },
  }),
  RadioContainerSx = (selected) => ({
    borderColor: selected ? "#f44336" : "none",
    boxShadow: selected ? "0 0 10px #f44336" : "none",
    marginTop: "10px",
    border: "1px solid #455a64",
    borderRadius: "5px",
    borderRight: "none",
    borderBottomRightRadius: "0px",
    borderTopRightRadius: "0px",
  }),
  RadioSx = {
    padding: 0,
    paddingLeft: "5px",
    paddingRight: "5px",
    marginTop: "3px",
    "& .MuiSvgIcon-root": {
      fontSize: 16,
    },
  },
  ProgressSx = {
    height: "30px",
    [`& .MuiLinearProgress-bar`]: {
      borderRadius: "5px",
      borderBottomLeftRadius: "0px",
      borderTopLeftRadius: "0px",
    },
  },
  OptionValueSx = {
    position: "absolute",
    top: "1.5px",
    left: "5px",
    width: "100%",
    display: "flex",
  },
  RemoveSx = {
    position: "absolute",
    top: "0.5px",
    right: "5px",
    display: "flex",
  },
  RemoveBtnSx = {
    top: "-2px",
    right: "-5px",
    position: "relative",
  },
  TextSx = {
    overflowX: "scroll",
    width: "calc(95% - 70px)",
    marginTop: "2px",
    whiteSpace: "nowrap",
  };

const PollOption = React.memo((props) => {
  const [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    removeOption = async () => {
      const response = await PollManager.RemoveOption(props.signalR, props.pollOptionId);
      if (response) closeConfirmPrompt();
    },
    voteOption = async () => {
      if (!props.isAdmin && !props.configuration.acceptNewVotes) return;
      const response = await PollManager.VoteOption(props.signalR, props.pollOptionId);

      if (response > 0) props.setSelectedOption(response);
      else if (response === -1) props.setSelectedOption(0);
    },
    isSelected = props.selectedOption === props.pollOptionId;

  return (
    <Box display="flex">
      <Box sx={RadioContainerSx(isSelected)}>
        <Radio checked={isSelected} onClick={voteOption} sx={RadioSx} />
      </Box>
      <Box sx={PollOptionSx(isSelected)}>
        <LinearProgress variant="determinate" value={props.percentage ?? 0} sx={ProgressSx} />
        <Box sx={OptionValueSx}>
          <Box sx={TextSx} className="drawer-poll drawer-poll-secondary">
            {props.value}
          </Box>
        </Box>
        <Box sx={RemoveSx}>
          <Chip label={props.voteCount} size="small" color="secondary" sx={{ marginTop: "3px" }} />
          {props.isAdmin && (
            <>
              <IconButton onClick={openConfirmPrompt} sx={RemoveBtnSx}>
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              {showPromptDialog && (
                <ConfirmDialog title="Remove option?" confirm={removeOption} cancel={closeConfirmPrompt} />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default PollOption;
