import { useRef, useState } from "react";
import ReactPlayer from "react-player";

const NativePlayerInstance = ({ url }) => {
  const [muted, setMuted] = useState(false),
    video = useRef(),
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    };
  return (
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
  );
};

export default NativePlayerInstance;
