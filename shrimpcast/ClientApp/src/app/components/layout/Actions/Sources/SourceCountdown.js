import { Box, Typography } from "@mui/material";
import { AutoTextSize } from "auto-text-size";
import CountdownTimer from "../../../others/CountdownTimer";

const CountdownContainerSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center !important",
  height: "100%",
  ml: 1,
  mr: 1,
};

const SourceCountdown = ({ startsAt }) => {
  return (
    <Box sx={CountdownContainerSx}>
      {Boolean(window.ResizeObserver) ? (
        <AutoTextSize maxFontSizePx={400} mode="boxoneline">
          <CountdownTimer timestamp={startsAt} skipText={true} />
        </AutoTextSize>
      ) : (
        <Typography variant="h1">
          <CountdownTimer timestamp={startsAt} skipText={true} />
        </Typography>
      )}
    </Box>
  );
};

export default SourceCountdown;
