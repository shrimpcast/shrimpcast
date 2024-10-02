import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent, Divider, Typography, Button } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const DialogSx = {
    borderRadius: "10px",
    boxShadow: 24,
    bgcolor: "#424242",
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
    bgcolor: "#ff9800",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    "&:hover": {
      bgcolor: "#e68900",
    },
  };

const GoldenPassDialog = (props) => {
  const { closeDialog, configuration, goldenPassTitle } = props;

  return (
    <Dialog open={true} onClose={closeDialog} maxWidth={"sm"} fullWidth PaperProps={{ sx: DialogSx }}>
      <DialogTitle sx={{}}>
        <Box sx={DialogTitleSx}>
          <Typography variant="h6">
            GET YOUR {goldenPassTitle}{" "}
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
          Buy the {goldenPassTitle} golden pass to support the site! Enjoy benefits such as:
        </Typography>
        <Box marginTop="10px" mb={3}>
          <Typography variant="body2">- Priority voting (x2)</Typography>
          <Typography variant="body2" className="golden-glow">
            - Glowie username
          </Typography>
          <Typography variant="body2">- Unlimited duration </Typography>
          <Typography variant="body2">- 100% anonymous via crypto</Typography>
        </Box>
        <Box justifyContent="center" display="flex">
          <Button variant="contained" sx={BuyButtonSx}>
            Buy Golden Pass (USD ${configuration.goldenPassValue})
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GoldenPassDialog;
