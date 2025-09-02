import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import PickSource from "../layout/Actions/Sources/PickSource";
import XGPlayer from "./XGPlayer";
import VideoJSPlayer from "./VideoJSPlayer";
import SignalRManager from "../../managers/SignalRManager";
import { useNavigate } from "react-router-dom";
import SourceCountdown from "../layout/Actions/Sources/SourceCountdown";
import ChatActionsManager from "../../managers/ChatActionsManager";

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
    url = source.url || "",
    video = useRef(),
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
      poster: url.includes("/memfs/") ? url.substr(0, url.lastIndexOf(".")) + ".jpg" : thumbnail,
    },
    isFLV = url.endsWith(".flv"),
    forceM3U8 = isFLV && !window.MediaSource,
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

  if (isFLV && forceM3U8) {
    videoJsOptions.sources[0].src = url.substr(0, url.lastIndexOf(".")) + ".m3u8";
    console.log("Forcing M3U8 because FLV is not supported.");
  }

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
        signalR={signalR}
      />
    ) : showCountdown ? (
      <SourceCountdown startsAt={startsAt} />
    ) : isFLV && !forceM3U8 ? (
      <XGPlayer url={url} />
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
      <VideoJSPlayer options={videoJsOptions} />
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
