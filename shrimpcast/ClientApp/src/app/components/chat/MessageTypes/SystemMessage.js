import { Box, Typography } from "@mui/material";
import React from "react";
import ManageUserDialog from "../ManageUserDialog";
import MessageWrapper from "./MessageWrapper";

const WrapperTextBoxSx = (isAdmin) => ({
    textAlign: "center",
    margin: "5px 0",
    padding: "8px 10px",
    wordWrap: "break-word",
    position: "relative",
    "&:hover": {
      backgroundColor: "primary.800",
    },
    minHeight: isAdmin ? "30px" : "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  TextSx = {
    fontWeight: "bold",
    color: "white",
    fontSize: "small",
  },
  OverlaySx = {
    width: "auto",
    position: "absolute",
    right: 0,
    padding: 0,
    borderRadius: "5px",
    display: "flex",
    visibility: "hidden",
    zIndex: 2,
  },
  OverlayButtonSx = {
    color: "white",
    backgroundColor: "primary.500",
    fontSize: "16px",
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    marginRight: "2px",
  };

const SystemMessage = React.memo((props) => {
  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box className="wrapper-comment" sx={WrapperTextBoxSx(props.siteAdmin)}>
        {props.siteAdmin && (
          <Box className="wrapper-overlay" sx={OverlaySx}>
            <ManageUserDialog OverlayButtonSx={OverlayButtonSx} {...props} />
          </Box>
        )}
        <Typography sx={TextSx}>{props.content}</Typography>
      </Box>
    </MessageWrapper>
  );
});

export default SystemMessage;
