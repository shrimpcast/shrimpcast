import { Box, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoJSPlayer from "./VideoJSPlayer";
import XPlayer from "./XPlayer";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const {
      enableMultistreams,
      usePrimarySource,
      primaryStreamUrl,
      secondaryStreamUrl,
      streamEnabled,
      useRTCEmbed,
      useLegacyPlayer,
    } = props.configuration,
    url = enableMultistreams
      ? props.useMultistreamSecondary
        ? secondaryStreamUrl
        : primaryStreamUrl
      : usePrimarySource
      ? primaryStreamUrl
      : secondaryStreamUrl,
    [muted, setMuted] = useState(false),
    video = useRef(),
    videoJsOptions = {
      autoplay: true,
      controls: true,
      fill: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
    },
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    },
    isFLV = url.endsWith(".flv"),
    forceM3U8 = isFLV && !window.MediaSource;

  if (isFLV && forceM3U8) {
    videoJsOptions.sources[0].src = url.substr(0, url.lastIndexOf(".")) + ".m3u8";
    console.log("Forcing M3U8 because FLV is not supported.");
  }

  return streamEnabled ? (
    isFLV && !forceM3U8 ? (
      <XPlayer url={url} />
    ) : useRTCEmbed ? (
      <iframe
        src={`${url}?muted=false&autoplay=true`}
        title="rtc-embed"
        id="rtc-embed"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    ) : !useLegacyPlayer ? (
      <VideoJSPlayer options={videoJsOptions} />
    ) : (
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        controls
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
