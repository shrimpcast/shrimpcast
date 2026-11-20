import { Box, Typography } from "@mui/material";

const WrapperSx = {
    width: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    boxSizing: "border-box",
    px: { xs: 2, sm: 4, md: 6 },
    py: { xs: 2, sm: 3 },
  },
  TextSx = {
    textAlign: "center",
    maxWidth: "100ch",
    overflowWrap: "anywhere",
    textWrap: "balance",
    lineHeight: 1.2,
    fontSize: "clamp(1.75rem, 1rem + 4vw, 3.75rem)",
  };

const NothingPlaying = ({ message }) => {
  return (
    <Box sx={WrapperSx}>
      <Typography className="noselect" variant="h2" sx={TextSx}>
        {message}
      </Typography>
    </Box>
  );
};

export default NothingPlaying;
