import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Stack, Divider } from "@mui/material";
import MediaServerManager from "../../../../managers/MediaServerManager";

const StreamStats = ({ signalR }) => {
  return (
    <Box mt={1} mr={1} p={1.5} borderRadius={2} bgcolor="background.paper" boxShadow={1} width="100%">
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Stream stats
        <Divider />
      </Typography>
    </Box>
  );
};

export default StreamStats;
