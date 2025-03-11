import { Box, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import XGPlayer from "./XGPlayer";
import PickSource from "../layout/Actions/Sources/PickSource";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const { streamStatus } = props,
    { source, streamEnabled, mustPickStream } = streamStatus,
    { useRTCEmbed, useLegacyPlayer } = source;
  let url = source.url || "";
  const video = useRef(),
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
    };

  if (isFLV && forceM3U8) {
    url = url.substr(0, url.lastIndexOf(".")) + ".m3u8";
    console.log("Forcing M3U8 because FLV is not supported.");
  }

  return streamEnabled ? (
    mustPickStream ? (
      <PickSource sources={streamStatus.sources} />
    ) : useRTCEmbed ? (
      <iframe src={`${url}`} title="rtc-embed" id="rtc-embed" allow="autoplay" allowFullScreen></iframe>
    ) : !useLegacyPlayer ? (
      <XGPlayer isFlv={isFLV} url={url} />
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
