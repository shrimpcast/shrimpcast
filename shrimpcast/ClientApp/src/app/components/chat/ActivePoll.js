import { Box, Button, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import PollIcon from "@mui/icons-material/Poll";
import Poll from "../polls/Poll";

const PollButtonSx = {
  bgcolor: "primary.800",
  borderRadius: "0px",
  width: "100%",
  textAlign: "center",
  height: "35px",
  maxHeight: "35px",
  display: "flex",
  justifyContent: "center",
},
  DrawerSx = {
    maxHeight: "min(calc(100% - 63px), 225px)",
    backgroundColor: "primary.800",
    position: "absolute",
    width: '100%',
    zIndex: 2,
    overflowY: "scroll",
  };

const ActivePoll = (props) => {
  const [show, setShow] = useState(true),
    toggleStatus = () => setShow(!show),
    { showPoll } = props.configuration;

  useEffect(() => {
    if (showPoll) setShow(true);
  }, [showPoll]);

  return (
    <Box hidden={!showPoll}>
      <Paper sx={PollButtonSx}>
        <Button
          sx={{ width: "100%" }}
          color="secondary"
          variant="outlined"
          endIcon={<PollIcon />}
          onClick={toggleStatus}
        >
          <Box marginTop="2.5px">{show ? "Hide" : "Show"} poll</Box>
        </Button>
      </Paper>
      <Slide direction="left" in={show}>
        <Box sx={DrawerSx} className="drawer-poll">
          <Poll {...props} />
        </Box>
      </Slide>
    </Box>
  );
};

export default ActivePoll;
