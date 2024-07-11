import { Box, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Bingo from "../bingo/Bingo";

const BingoButtonSx = (height) => ({
    bgcolor: "primary.800",
    borderRadius: "0px",
    width: "100%",
    textAlign: "center",
    height: `${height}px`,
    maxHeight: `${height}px`,
    display: "flex",
    justifyContent: "center",
  }),
  ExpandLessBtnSx = {
    height: "20px",
    width: "20px",
    position: "absolute",
    top: "-4px",
  };

const ActiveBingo = (props) => {
  const { configuration, bingoButtonExpanded, setBingoButtonExpanded } = props,
    { showBingo } = configuration,
    toggleExpanded = () => setBingoButtonExpanded(!bingoButtonExpanded),
    [displayBingo, setDisplayBingo] = useState(false),
    openBingo = () => setDisplayBingo(true);

  return (
    <Box hidden={!showBingo}>
      <Paper sx={BingoButtonSx(bingoButtonExpanded ? 35 : 10)}>
        {bingoButtonExpanded ? (
          <>
            <Button sx={{ width: "100%" }} color="secondary" endIcon={<GridOnOutlinedIcon />} onClick={openBingo}>
              <Box marginTop="2.5px">Show bingo</Box>
            </Button>
            <IconButton onClick={toggleExpanded} color="secondary">
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <IconButton sx={{ width: "100%", borderRadius: 0 }} onClick={toggleExpanded} color="secondary">
            <ExpandLessIcon sx={ExpandLessBtnSx} />
          </IconButton>
        )}
      </Paper>
      <Bingo displayBingo={displayBingo} setDisplayBingo={setDisplayBingo} {...props} />
    </Box>
  );
};

export default ActiveBingo;
