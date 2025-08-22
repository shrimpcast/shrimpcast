import { useState } from "react";
import { Box, Dialog, DialogContent, IconButton, Typography, Tooltip, Divider } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const TitleSx = {
    fontFamily: "Roboto, sans-serif",
    fontSize: "3rem",
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.2,
  },
  DescriptionSx = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "1.1rem",
    letterSpacing: 0.25,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
    mt: "5px",
  };

const SiteInfo = (props) => {
  const [open, setOpen] = useState(false),
    { enableChristmasTheme, streamDescription, enableHalloweenTheme, streamTitle } = props.configuration,
    handleOpen = () => setOpen(true),
    handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={`About ${streamTitle.trim() ? streamTitle.toLowerCase() : "this site"}`}>
        <IconButton
          sx={{ backgroundColor: "primary.700", borderRadius: "0px" }}
          onClick={handleOpen}
          size="small"
          color="primary"
        >
          <InfoIcon sx={{ color: "primary.300" }} />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
          <Box sx={{ wordBreak: "break-word" }}>
            <Typography
              color="secondary.main"
              className={`neon-text ${
                streamTitle
                  ? enableChristmasTheme
                    ? "santa-hat-primary"
                    : enableHalloweenTheme
                    ? "halloween-hat-primary"
                    : null
                  : null
              }`}
              sx={TitleSx}
            >
              {streamTitle}
            </Typography>
            <Divider />
            <Typography className="neon-text" color="secondary.main" sx={DescriptionSx}>
              {streamDescription.replace(/\\n/g, "\n")}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SiteInfo;
