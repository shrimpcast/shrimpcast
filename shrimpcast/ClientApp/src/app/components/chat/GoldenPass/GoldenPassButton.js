import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import GoldenPassDialog from "./GoldenPassDialog";
import CloseIcon from "@mui/icons-material/Close";

const GoldenPassSx = {
    width: "100%",
    height: "20px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "secondary.900",
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
  CloseIconSx = {
    height: "15px",
    p: 0,
    position: "relative",
    top: "2.5px",
    float: "right",
    mr: "2.5px",
  };

const GoldenPassButton = (props) => {
  const { isAdmin, configuration, goldenPassExpanded, setGoldenPassExpanded, isGolden } = props,
    { showGoldenPassButton } = configuration,
    [showDialog, setShowDialog] = useState(false),
    openDialog = () => setShowDialog(true),
    closeDialog = () => setShowDialog(false),
    goldenPassTitle = configuration.goldenPassTitle
      ? configuration.goldenPassTitle.toUpperCase()
      : configuration.streamTitle.toUpperCase(),
    closeButton = () => setGoldenPassExpanded(false);

  return !isAdmin && !isGolden && showGoldenPassButton && goldenPassExpanded ? (
    <>
      <Box sx={GoldenPassSx} onClick={openDialog} className="animated-background">
        <Typography className="noselect" variant="caption" sx={TextSx}>
          GET THE {goldenPassTitle}{" "}
          <Typography variant="span" color="secondary.300">
            GOLDEN PASS
          </Typography>
        </Typography>
        <IconButton onClick={closeButton} type="button" size="small" sx={CloseIconSx}>
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
      </Box>
      {showDialog && <GoldenPassDialog closeDialog={closeDialog} goldenPassTitle={goldenPassTitle} {...props} />}
    </>
  ) : null;
};

export default GoldenPassButton;
