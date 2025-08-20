import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalRManager from "../../managers/SignalRManager";

const RTTSx = {
    position: "absolute",
    top: "1px",
    left: "1px",
    backgroundColor: "primary.800",
    height: "13.5px",
    display: "flex",
    borderTopLeftRadius: "2px",
  },
  SignalIconSx = (color) => ({
    position: "relative",
    top: "1px",
    fontSize: "small",
    mr: "1px",
    left: "1px",
    color,
  }),
  SignalTextSx = (color) => ({
    pr: "2px",
    fontWeight: "bold",
    position: "relative",
    bottom: "1.5px",
    color,
  }),
  WiFiColours = { high: "success.main", medium: "warning.main", low: "error.main" },
  WiFIIcons = {
    [WiFiColours.high]: SignalCellularAltIcon,
    [WiFiColours.medium]: SignalCellularAlt2BarIcon,
    [WiFiColours.low]: SignalCellularAlt1BarIcon,
  };

const WiFiSignalStrength = (props) => {
  const { signalR } = props,
    [rtt, setRtt] = useState(0),
    rttName = rtt <= 250 ? WiFiColours.high : rtt > 250 && rtt <= 500 ? WiFiColours.medium : WiFiColours.low,
    RttComponent = WiFIIcons[rttName];

  useEffect(() => {
    const addHandlers = () => {
        signalR.on(SignalRManager.events.pong, (Timestamp) => setRtt(Date.now() - Timestamp));
        const ping = () => signalR.invoke(SignalRManager.events.ping, Date.now()).catch((ex) => console.log(ex));
        ping();
        window.interval = setInterval(ping, 5000);
      },
      removeHandlers = () => {
        clearInterval(window.interval);
        signalR.off(SignalRManager.events.pong);
      };

    addHandlers();
    return () => removeHandlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rtt ? (
    <Box sx={RTTSx}>
      <RttComponent ml="auto" sx={SignalIconSx(rttName)} />
      <Typography className="noselect" variant="caption" sx={SignalTextSx(rttName)}>
        {rtt}ms
      </Typography>
    </Box>
  ) : null;
};

export default WiFiSignalStrength;
