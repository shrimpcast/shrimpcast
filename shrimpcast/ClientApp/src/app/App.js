import React from "react";
import Layout from "./components/Layout";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@emotion/react";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import SignalRManager from "./managers/SignalRManager";
import { useEffect } from "react";
import CenteredSpinner from "./components/loaders/CenteredSpinner";
import ErrorAlert from "./components/layout/ErrorAlert";
import TokenManager from "./managers/TokenManager";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import FallbackError from "./components/layout/FallbackError";
import makeTheme from "./theme/makeTheme";

const App = () => {
  const [loading, setLoading] = useState(true),
    [signalR, setSignalR] = useState({}),
    [connectionDataState, setConnectionDataState] = useState({}),
    [disconnectMessage, setDisconnectMessage] = useState(null);

  const addSocketEvents = (connection) => {
    const updateConnectionStatus = () =>
      setConnectionDataState((state) => ({
        ...state,
        connectionStatus: connection._connectionState,
      }));

    const fetchLatestData = async () => {
      const updatedData = await TokenManager.EnsureTokenExists(null);
      if (updatedData.message) {
        setDisconnectMessage(updatedData.message);
        return;
      }

      setConnectionDataState((state) => ({
        ...state,
        ...updatedData,
        // Refresh this property in case the server updates in real time
        FRONTEND_NEEDS_UPDATE: process.env.REACT_APP_VERSION !== updatedData.version,
      }));
    };

    connection.onclose(() => !disconnectMessage && setSignalR({ errorAtLoad: true }));
    connection.onreconnecting(() => updateConnectionStatus());
    connection.onreconnected(() => {
      updateConnectionStatus();
      fetchLatestData();
    });

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

    connection.on(SignalRManager.events.modStatusUpdate, (isMod) =>
      setConnectionDataState((state) => ({
        ...state,
        isMod,
      }))
    );

    connection.on(SignalRManager.events.goldStatusUpdate, (isGolden) =>
      setConnectionDataState((state) => ({
        ...state,
        isGolden,
      }))
    );

    connection.on(SignalRManager.events.emoteAdded, (emote) =>
      setConnectionDataState((state) => ({
        ...state,
        emotes: state.emotes.concat(emote),
      }))
    );

    connection.on(SignalRManager.events.emoteRemoved, (emoteId) =>
      setConnectionDataState((state) => ({
        ...state,
        emotes: state.emotes.filter((emote) => emote.emoteId !== emoteId),
      }))
    );

    updateConnectionStatus();
  };

  useEffect(() => {
    const connectSignalR = async (abortControllerSignal) => {
      if (!loading) return;
      const response = await TokenManager.EnsureTokenExists(abortControllerSignal);
      if (abortControllerSignal.aborted) return;

      setConnectionDataState((state) => ({
        ...state,
        ...response,
        FRONTEND_NEEDS_UPDATE: process.env.REACT_APP_VERSION !== response.version,
      }));

      if (response.message) {
        setLoading(false);
        setDisconnectMessage(response.message);
        return;
      }

      const newConnection = await SignalRManager.connect(),
        errorAtLoad = newConnection._connectionState !== "Connected";

      setLoading(false);
      addSocketEvents(newConnection);
      setSignalR(errorAtLoad ? { errorAtLoad } : newConnection);
    };

    const abortController = new AbortController();
    connectSignalR(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={makeTheme(connectionDataState?.configuration)}>
      <CssBaseline />
      <HelmetProvider>
        <Helmet>
          <title>{connectionDataState?.configuration?.streamTitle}</title>
        </Helmet>
      </HelmetProvider>
      {loading ? (
        <CenteredSpinner />
      ) : signalR.errorAtLoad || disconnectMessage ? (
        <ErrorAlert disconnectMessage={disconnectMessage} />
      ) : (
        <ErrorBoundary fallbackRender={FallbackError}>
          <Layout signalR={signalR} {...connectionDataState} />
        </ErrorBoundary>
      )}
      {connectionDataState?.version && connectionDataState?.FRONTEND_NEEDS_UPDATE && (
        <Snackbar open={true}>
          <Alert severity={"error"} variant="filled" sx={{ width: "100%" }}>
            You are using an outdated version. Please perform a hard refresh or clear your cache and reload the page.
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

export default App;
