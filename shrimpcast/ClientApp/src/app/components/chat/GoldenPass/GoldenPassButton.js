import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GoldenPassDialog from "./GoldenPassDialog";

const GoldenPassSx = {
    width: "100%",
    height: "20px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "secondary.400",
    textAlign: "center",
    borderRadius: "1px",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    cursor: "pointer",
  },
  TextSx = {
    height: "15px",
    fontSize: 12.5,
    fontWeight: "bold",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
    width: "100%",
    bottom: "3px",
    position: "relative",
  },
  IconSx = {
    height: "15px",
    fontSize: "12px",
    position: "relative",
    top: "3px",
  };

const GoldenPassButton = (props) => {
  const { isAdmin, configuration } = props,
    { showGoldenPassButton } = configuration,
    [showDialog, setShowDialog] = useState(false),
    openDialog = () => setShowDialog(true),
    closeDialog = () => setShowDialog(false);

  return showGoldenPassButton && !isAdmin ? (
    <>
      <Box sx={GoldenPassSx} onClick={openDialog} className="rainbow-background">
        <Typography className="noselect" variant="caption" sx={TextSx}>
          GET THE {configuration.streamTitle.toUpperCase()}{" "}
          <span style={{ color: "#ff9800" }}>
            GOLDEN PASS
            <WorkspacePremiumIcon sx={IconSx} />
          </span>
        </Typography>
      </Box>
      {showDialog && <GoldenPassDialog closeDialog={closeDialog} {...props} />}
    </>
  ) : null;
};

export default GoldenPassButton;
