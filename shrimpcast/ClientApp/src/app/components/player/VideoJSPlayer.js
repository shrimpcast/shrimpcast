import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import { Box, CircularProgress } from "@mui/material";

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const VideoJSPlayer = (props) => {
  const videoRef = useRef(null),
    playerRef = useRef(null),
    [cssLoaded, setCssLoaded] = useState(false),
    { options } = props,
    play = (player) => {
      player.muted(false);
      setTimeout(() => {
        player.play().catch(() => {
          if (player && player.isDisposed()) return;
          player.muted(true);
          setTimeout(() => {
            player.play().catch(() => console.log("Could not autoplay"));
          }, 100);
        });
      }, 100);
    },
    destroy = () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    },
    [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!cssLoaded) return;
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      const player = (playerRef.current = videojs(videoElement, options, () => play(player)));

      // Reconnect logic

      const restart = (reason) => {
        clearTimeout(window._vjstimeout);
        console.log(`Attempting to restart playback, reason = ${reason}.`);
        destroy();
        setIsError(Date.now());
      };

      player.on("error", () => {
        clearTimeout(window._vjstimeout);
        window._vjstimeout = setTimeout(() => restart("error"), 3000);
      });

      player.on("ended", () => {
        clearTimeout(window._vjstimeout);
        restart("ended");
      });

      player.on("waiting", () => {
        clearTimeout(window._vjstimeout);
        window._vjstimeout = setTimeout(() => {
          try {
            if (player?.readyState() <= 2) {
              restart("waiting");
            }
          } catch (e) {}
        }, 5000);
      });

      if (isError) {
        setIsError(false);
      }
      // Update an existing player in the `else` block here
    } else {
      const player = playerRef.current;
      if (player.src() === options.sources[0].src) return;
      player.src(options.sources);
      play(player);
    }
  }, [options, videoRef, cssLoaded, isError]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => destroy();
  }, [playerRef]);

  useEffect(() => {
    const importCSS = async () => {
      await import("video.js/dist/video-js.css");
      setCssLoaded(true);
    };

    if (!cssLoaded) importCSS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!cssLoaded && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      <div data-vjs-player className="full-height">
        <div ref={videoRef} className="full-height" />
      </div>
    </>
  );
};

export default VideoJSPlayer;
