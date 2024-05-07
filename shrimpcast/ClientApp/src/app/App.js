import React from "react";
import Layout from "./components/Layout";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { orange, blueGrey } from "@mui/material/colors";
import { useState } from "react";
import SignalRManager from "./managers/SignalRManager";
import { useEffect } from "react";
import CenteredSpinner from "./components/loaders/CenteredSpinner";
import ErrorAlert from "./components/layout/ErrorAlert";
import TokenManager from "./managers/TokenManager";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: blueGrey,
    secondary: orange,
    background: {
      default: blueGrey[900],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
});

const App = () => {
  const [loading, setLoading] = useState(true),
    [signalR, setSignalR] = useState({}),
    [connectionDataState, setConnectionDataState] = useState({}),
    [disconnectMessage, setDisconnectMessage] = useState(null);

  const addReconnectHandlers = (connection) => {
    const updateConnectionStatus = () =>
      setConnectionDataState((state) => ({
        ...state,
        connectionStatus: connection._connectionState,
      }));

    connection.onreconnecting(() => updateConnectionStatus());
    connection.onreconnected(() => updateConnectionStatus());
    connection.onclose(() => !disconnectMessage && setSignalR({ errorAtLoad: true }));

    connection.on(SignalRManager.events.forceDisconnect, (message) => {
      setDisconnectMessage(message);
      connection.stop();
    });

    connection.on(SignalRManager.events.configUpdated, (configuration) =>
      setConnectionDataState((state) => ({
        ...state,
        configuration,
      }))
    );

    updateConnectionStatus();
  };

  useEffect(() => {
    const connectSignalR = async (abortControllerSignal) => {
      if (!loading) return;
      const response = await TokenManager.EnsureTokenExists(abortControllerSignal);
      if (abortControllerSignal.aborted) return;
      if (response.message) {
        setLoading(false);
        setDisconnectMessage(response.message);
        return;
      }
      const newConnection = await SignalRManager.connect(),
        errorAtLoad = newConnection._connectionState !== "Connected";

      setLoading(false);
      setConnectionDataState((state) => ({
        ...state,
        ...response,
      }));
      addReconnectHandlers(newConnection, true);
      setSignalR(errorAtLoad ? { errorAtLoad } : newConnection);
    };

    const abortController = new AbortController();
    connectSignalR(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <CenteredSpinner />
      ) : signalR.errorAtLoad || disconnectMessage ? (
        <ErrorAlert disconnectMessage={disconnectMessage} />
      ) : (
        <Layout signalR={signalR} {...connectionDataState} />
      )}
    </ThemeProvider>
  );
};

export default App;
