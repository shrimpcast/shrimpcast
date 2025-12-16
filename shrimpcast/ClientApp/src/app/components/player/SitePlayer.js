import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import PickSource from "../layout/Actions/Sources/PickSource";
import VideoJSPlayer from "./VideoJSPlayer";
import SignalRManager from "../../managers/SignalRManager";
import { useNavigate } from "react-router-dom";
import SourceCountdown from "../layout/Actions/Sources/SourceCountdown";
import ChatActionsManager from "../../managers/ChatActionsManager";
import LoadBalancingManager from "../../managers/LoadBalancingManager";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const { streamStatus, signalR, configuration } = props,
    { source, streamEnabled, mustPickStream } = streamStatus,
    { useRTCEmbed, useLegacyPlayer, startsAt, withCredentials, thumbnail } = source,
    [url, setUrl] = useState(""),
    video = useRef(),
    theme = useTheme(),
    videoJsOptions = {
      autoplay: true,
      controls: true,
      fill: true,
      playsinline: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
      html5: {
        vhs: {
          withCredentials,
        },
      },
      poster: url.includes("/streams/")
        ? url.substr(0, url.lastIndexOf(".")) + `.jpg?nocache=${Date.now()}`
        : thumbnail,
    },
    [muted, setMuted] = useState(false),
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    },
    navigate = useNavigate(),
    showCountdown = startsAt && new Date(startsAt).getTime() - Date.now() > 0;

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

  useEffect(() => {
    const resolved = LoadBalancingManager.ResolveBalancing(source.url);
    if (resolved) setUrl(resolved);
  }, [source.url]);

  return streamEnabled ? (
    mustPickStream ? (
      <PickSource
        showViewerCountPerStream={configuration.showViewerCountPerStream}
        sources={streamStatus.sources}
        signalR={signalR}
        noCache={Date.now()}
      />
    ) : showCountdown ? (
      <SourceCountdown startsAt={startsAt} />
    ) : useRTCEmbed ? (
      <iframe
        src={`${url}`}
        title="rtc-embed"
        id="rtc-embed"
        allow="autoplay"
        frameBorder="no"
        scrolling="no"
        allowFullScreen
      ></iframe>
    ) : !useLegacyPlayer ? (
      <VideoJSPlayer options={videoJsOptions} theme={theme} />
    ) : (
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
        playsinline
        url={url}
        ref={video}
        playing={muted}
        muted={muted}
        onReady={tryPlay}
      />
    )
  ) : (
    <Box sx={WrapperSx}>
      <Typography className="noselect" textAlign="center" variant="h2">
        Nothing playing right now
      </Typography>
    </Box>
  );
};

export default SitePlayer;
