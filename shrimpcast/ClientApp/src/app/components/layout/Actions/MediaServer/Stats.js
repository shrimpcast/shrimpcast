import { Box, Divider, Typography, useTheme } from "@mui/material";
import SystemStats from "./SystemStats";
import StreamStats from "./StreamStats";

const ContainerSx = (theme) => ({
    display: "flex",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  }),
  StatsSx = (theme) => ({
    width: "75%",
    mr: 1,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      mr: 0,
    },
  }),
  SystemSx = (theme) => ({
    width: "25%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  });

const Stats = () => {
  const theme = useTheme();

  return (
    <Box display="block">
      <Box sx={ContainerSx(theme)}>
        <Box sx={StatsSx(theme)}>
          <StreamStats />
        </Box>
        <Box sx={SystemSx(theme)}>
          <SystemStats />
        </Box>
      </Box>
      <Typography variant="overline" mt={1} mb={1}>
        CONFIGURE STREAMS
        <Divider />
      </Typography>
    </Box>
  );
};

export default Stats;
