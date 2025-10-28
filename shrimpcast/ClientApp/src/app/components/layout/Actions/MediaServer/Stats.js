import { Box, Divider, Typography } from "@mui/material";
import SystemStats from "./SystemStats";
import StreamStats from "./StreamStats";

const Stats = () => {
  return (
    <Box display="block">
      <Box display="flex">
        <StreamStats mr={1} />
        <SystemStats />
      </Box>
      <Typography variant="overline" mt={1} mb={1}>
        CONFIGURE STREAMS
        <Divider />
      </Typography>
    </Box>
  );
};

export default Stats;
