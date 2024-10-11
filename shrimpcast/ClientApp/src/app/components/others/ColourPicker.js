import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
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
  }),
  IconButtonSx = (userDisplayColor, width, useBorderRadius) => ({
    borderRadius: useBorderRadius ? "5px" : "1px",
    backgroundColor: userDisplayColor,
    width: width ? width : "auto",
  });

const ColourPicker = (props) => {
  const { colours, executeCallback, text, width, useBorderRadius } = props,
    [userDisplayColor, setUserDisplayColor] = useState(props.userDisplayColor),
    [showColours, setShowColours] = useState(false),
    toggleState = () => setShowColours(!showColours),
    handleClose = () => setShowColours(false),
    changeColour = async (nameColourId) => {
      const colourChanged = await executeCallback(nameColourId);
      if (!colourChanged) return;
      setUserDisplayColor(colourChanged);
      handleClose();
    };

  return (
    <>
      <IconButton
        onClick={toggleState}
        type="button"
        size="small"
        sx={IconButtonSx(userDisplayColor, width, useBorderRadius)}
      >
        <ColorLensIcon />
        {text && (
          <Typography mt="2.5px" ml="5px">
            {text}
          </Typography>
        )}
      </IconButton>
      {showColours && (
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={ColoursWrapperSx} elevation={2}>
            <Box sx={ColoursSx}>
              {colours.map((colour) => (
                <IconButton
                  onClick={() => changeColour(colour.nameColourId)}
                  key={colour.nameColourId}
                  type="button"
                  size="small"
                  sx={ColourSx(colour, userDisplayColor === colour.colourHex)}
                ></IconButton>
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default ColourPicker;
