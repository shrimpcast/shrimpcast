import { Box, CircularProgress, Typography } from "@mui/material";

const Centered = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%)",
  textAlign: "center",
};

const CenteredSpinner = () => {
  return (
    <Box sx={Centered}>
      <CircularProgress color="secondary" size={50} sx={{ ml: "auto", mr: "auto" }} />
      <Typography variant="overline" display="block" fontWeight="bold" color="secondary.500" sx={{ lineHeight: 1.5 }}>
        LOADING PROFILE
      </Typography>
      <Typography variant="caption" display="block" fontWeight="bold" color="secondary.500" sx={{ fontSize: "10px" }}>
        POWERED BY SHRIMPCAST
      </Typography>
    </Box>
  );
};

export default CenteredSpinner;
