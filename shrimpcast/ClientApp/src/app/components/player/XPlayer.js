import { useState, useEffect } from "react";
import postscribe from "postscribe";
import { Box, CircularProgress } from "@mui/material";

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const XPlayer = (props) => {
  const elId = "xg-player-cont",
    [loadState, setLoadState] = useState({
      css: false,
      player: false,
      flv: false,
    });

  useEffect(() => {
    if (!loadState.css)
      postscribe("#player-xg-css", '<link rel="stylesheet" href="./xg/index.min.css"/>', {
        done: () => setLoadState((state) => ({ ...state, css: true })),
      });
    if (!loadState.player)
      postscribe("#player-xg", '<script src="./xg/player.xg.js"></script>', {
        done: () => setLoadState((state) => ({ ...state, player: true })),
      });
    if (!loadState.flv)
      postscribe("#player-xg-flv", '<script src="./xg/xg.flv.js"></script>', {
        done: () => setLoadState((state) => ({ ...state, flv: true })),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadState.css || !loadState.player || !loadState.flv) return;
    let player = new window.Player({
      id: elId,
      isLive: true,
      playsinline: true,
      url: props.url,
      autoplay: true,
      height: undefined,
      width: undefined,
      plugins: [window.FlvPlayer],
      lang: "en",
      playbackRate: false,
      cssFullscreen: false,
      screenShot: true,
      pip: true,
    });

    player.on("error", () => player.replay());
    player.on("ended", () => player.replay());
    player.on("waiting", () => {
      clearTimeout(window.timeout);
      window.timeout = setTimeout(() => {
        try {
          if (player?.readyState <= 2) {
            player.replay();
            console.log("Playback restarted.");
          }
        } catch (e) {}
      }, 5000);
    });

    return () => player.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, props.url]);

  return (
    <div className="full-height">
      {(!loadState.css || !loadState.player || !loadState.flv) && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      <div id="player-xg-css" />
      <div id="player-xg" />
      <div id="player-xg-flv" />
      <div id={elId} />
    </div>
  );
};

export default XPlayer;
