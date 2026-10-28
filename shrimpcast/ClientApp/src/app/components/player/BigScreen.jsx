import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import PickSource from "../layout/Actions/Sources/PickSource";
import VideoJSInstance from "./VideoJSInstance";
import SignalRManager from "../../managers/SignalRManager";
import { useNavigate } from "react-router-dom";
import SourceCountdown from "../layout/Actions/Sources/SourceCountdown";
import ChatActionsManager from "../../managers/ChatActionsManager";
import LoadBalancingManager from "../../managers/LoadBalancingManager";
import MultistreamPrompt from "../layout/Prompts/MultistreamPrompt";

const WrapperSx = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  PlayerWrapperSx = (theme, isMultistreaming) => ({
    width: `calc(100% - ${isMultistreaming ? 20 : 0}px)`,
    height: "100%",
    [theme.breakpoints.down("md")]: {
      height: `calc(100% - ${isMultistreaming ? 20 : 0}px)`,
      width: "100%",
    },
  });

const BigScreen = (props) => {
  const { streamStatus, signalR, configuration } = props,
    { source, streamEnabled, mustPickStream, isMultistreaming } = streamStatus,
    { startsAt, withCredentials, thumbnail } = source,
    theme = useTheme(),
    url = useMemo(
      () => LoadBalancingManager.ResolveBalancing(source),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [source.name, source.streamOverride, source.lbSettings],
    ),
    navigate = useNavigate(),
    showCountdown = (startsAt) => startsAt && new Date(startsAt).getTime() - Date.now() > 0,
    showMultistream = streamEnabled && isMultistreaming && !mustPickStream;

  const videoJsOptions = useMemo(() => {
    return {
      autoplay: true,
      controls: true,
      fill: true,
      playsinline: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
          withCredentials,
        },
      ],
      userActions: { hotkeys: true },
      controlBar: {
        progressControl: false,
        currentTimeDisplay: false,
        durationDisplay: false,
        timeDivider: false,
      },
    };
  }, [url, withCredentials]);

  useEffect(() => {
    signalR.on(SignalRManager.events.redirectSource, (data) => {
      const { from, to } = data;
      if (from === source?.name) {
        console.log(`Redirecting from ${from} to ${to}`);
        navigate(`/${to}`);
      }
    });

    ChatActionsManager.SetQueryParams(signalR, source?.name);
    return () => signalR.off(SignalRManager.events.redirectSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return streamEnabled ? (
    mustPickStream ? (
      <PickSource
        showViewerCountPerStream={configuration.showViewerCountPerStream}
        sources={streamStatus.sources}
        showCountdown={showCountdown}
        signalR={signalR}
        noCache={Date.now()}
      />
    ) : (
      <>
        <Box sx={PlayerWrapperSx(theme, isMultistreaming)}>
          {showCountdown(startsAt) ? (
            <SourceCountdown startsAt={startsAt} />
          ) : (
            <VideoJSInstance options={videoJsOptions} theme={theme} poster={thumbnail} />
          )}
        </Box>
        {showMultistream && (
          <MultistreamPrompt
            showViewerCountPerStream={configuration.showViewerCountPerStream}
            sources={streamStatus.sources}
            showCountdown={showCountdown}
            signalR={signalR}
          />
        )}
      </>
    )
  ) : (
    <Box sx={WrapperSx}>
      <Typography className="noselect" textAlign="center" variant="h2">
        Nothing playing right now
      </Typography>
    </Box>
  );
};

export default BigScreen;
