import { Box, Chip, IconButton, LinearProgress } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PollManager from "../../managers/PollManager";
import ConfirmDialog from "../others/ConfirmDialog";
import { Radio } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GenericActionList from "../layout/Actions/GenericActionList";

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
  ViewBtnSx = {
    marginTop: "3px",
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "secondary.900",
    },
  },
  TextSx = (buttonsWidth, showVotes) => ({
    overflowX: "auto",
    width: `calc(95% - ${showVotes ? buttonsWidth + 20 : buttonsWidth}px)`,
    marginTop: "2px",
    whiteSpace: "nowrap",
  });

const PollOption = React.memo((props) => {
  const { signalR, isAdmin, configuration } = props,
    [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    [submitting, setSubmitting] = useState(false),
    [showVotes, setShowVotes] = useState(false),
    openVotes = () => setShowVotes(true),
    closeVotes = () => setShowVotes(false),
    removeOption = async () => {
      setSubmitting(true);
      const response = await PollManager.RemoveOption(signalR, props.pollOptionId);
      if (response) closeConfirmPrompt();
      setSubmitting(false);
    },
    voteOption = async () => {
      if (submitting) return;

      setSubmitting(true);
      const response = await PollManager.VoteOption(signalR, props.pollOptionId);

      if (response > 0) props.setSelectedOption(response);
      else if (response === -1) props.setSelectedOption(0);
      setSubmitting(false);
    },
    isSelected = props.selectedOption === props.pollOptionId,
    showPublicVotes = isAdmin || configuration.showVotes;

  return (
    <Box display="flex">
      <Box sx={RadioContainerSx(isSelected)}>
        <Radio disabled={submitting} checked={isSelected} onClick={voteOption} sx={RadioSx} />
      </Box>
      <Box sx={PollOptionSx(isSelected)}>
        <LinearProgress variant="determinate" value={props.percentage ?? 0} sx={ProgressSx} />
        <Box sx={OptionValueSx}>
          <Box
            sx={TextSx(isAdmin ? 55.45 : 23.45, configuration.showVotes)}
            className="scrollbar-custom scrollbar-custom-secondary"
          >
            {props.value}
          </Box>
        </Box>
        <Box sx={RemoveSx}>
          <Chip
            icon={showPublicVotes ? <VisibilityIcon /> : null}
            label={props.voteCount}
            size="small"
            color="secondary"
            sx={showPublicVotes ? ViewBtnSx : { marginTop: "3px", fontWeight: "bold" }}
            onClick={showPublicVotes ? openVotes : null}
          />
          {showVotes && (
            <GenericActionList
              title={`Votes for [${props.value}]`}
              getItems={() => PollManager.ShowVotes(signalR, props.pollOptionId)}
              identifier="sessionId"
              contentIdentifier="sessionName"
              skipButton={true}
              {...props}
              createdAt={null}
              closeCallback={closeVotes}
              responseIsTitleObject={{
                appendTitle: "[{0} connected user(s)]",
                appendKey: "activeUsers",
                value: "votes",
                greenFlag: "connected",
              }}
            />
          )}
          {isAdmin && (
            <>
              <IconButton onClick={openConfirmPrompt} sx={RemoveBtnSx}>
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              {showPromptDialog && (
                <ConfirmDialog
                  isLoading={submitting}
                  title="Remove option?"
                  confirm={removeOption}
                  cancel={closeConfirmPrompt}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default PollOption;
