import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent, Divider, Typography, Button } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const DialogSx = {
    borderRadius: "10px", // Rounded corners for the dialog
    boxShadow: 24, // Material-UI elevation
    bgcolor: "#424242", // Dark background color
  },
  DialogTitleSx = {
    fontSize: "26px",
    pb: "10px",
    fontWeight: "bold",
    color: "#fff",
  },
  DialogContentSx = {
    padding: "20px",
    bgcolor: "#303030",
    borderRadius: "5px",
  },
  BuyButtonSx = {
    bgcolor: "#ff9800", // Button color
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px", // Rounded button
    "&:hover": {
      bgcolor: "#e68900", // Darker shade on hover
    },
  };

const GoldenPassDialog = (props) => {
  const { closeDialog, configuration } = props;

  return (
    <Dialog open={true} onClose={closeDialog} maxWidth={"md"} fullWidth PaperProps={{ sx: DialogSx }}>
      <DialogTitle sx={{}}>
        <Box sx={DialogTitleSx}>
          <Typography variant="h6">
            GET YOUR {configuration.streamTitle.toUpperCase()}{" "}
            <span style={{ color: "#ff9800" }}>
              GOLDEN PASS
              <WorkspacePremiumIcon sx={{ position: "relative", top: "5px" }} />
            </span>
          </Typography>
        </Box>
        <Divider color="#fff" />
      </DialogTitle>
      <DialogContent sx={DialogContentSx}>
        <Typography variant="body1" marginTop="5px">
          Buy the {configuration.streamTitle.toLowerCase()} golden pass to support the site! Enjoy benefits such as:
        </Typography>
        <Box marginTop="10px" mb={3}>
          <Typography variant="body2">- Priority voting</Typography>
          <Typography variant="body2">- Unique golden username</Typography>
          <Typography variant="body2">- Never expires </Typography>
          <Typography variant="body2">- 100% anonymous via crypto</Typography>
        </Box>
        <Box justifyContent="center" display="flex">
          <Button variant="contained" sx={BuyButtonSx}>
            Buy Golden Pass ($)
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GoldenPassDialog;
