import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Box, IconButton, Paper } from "@mui/material";
import { useState } from "react";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const ColoursWrapperSx = {
  position: "static",
  width: "100%",
  padding: "2px",
  paddingLeft: "7.5px",
  paddingTop: "12.5px",
  top: "35px",
  zIndex: 3,
},
  ColoursSx = {
    marginTop: "5px",
    marginBottom: "5px",
    maxHeight: "200px",
    overflowY: "scroll",
    ml: "auto",
    mr: "auto",
    width: "fit-content",
  },
  ColourSx = (colour, selected) => ({
    width: "35px",
    height: "35px",
    backgroundColor: colour.colourHex,
    borderRadius: "10px",
    ml: "7.5px",
    mb: "7.5px",
    border: selected ? "1px solid #f44336" : "none",
  });

const Colours = (props) => {
  const [selfColour, setSelfColour] = useState(props.selfColour),
    [showColours, setShowColours] = useState(false),
    toggleState = () => setShowColours(!showColours),
    handleClose = () => setShowColours(false),
    changeColour = async (nameColourId) => {
      let colourChanged = await ChatActionsManager.ChangeColour(props.signalR, nameColourId);
      if (!colourChanged) return;
      setSelfColour(colourChanged);
      handleClose();
    };

  return (
    <>
      <IconButton onClick={toggleState} type="button" size="small" sx={{ borderRadius: "1px", backgroundColor: selfColour }}>
        <ColorLensIcon />
      </IconButton>
      {showColours && (
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={ColoursWrapperSx} elevation={2}>
            <Box sx={ColoursSx}>
              {props.colours.map((colour) => (
                <IconButton
                  onClick={() => changeColour(colour.nameColourId)}
                  key={colour.nameColourId}
                  type="button"
                  size="small"
                  sx={ColourSx(colour, selfColour === colour.colourHex)}
                ></IconButton>
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default Colours;
