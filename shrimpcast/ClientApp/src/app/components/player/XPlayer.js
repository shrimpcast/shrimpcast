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
      flv: false,
      player: false,
    }),
    [triggerCacheUpdate, setTriggerCacheUpdate] = useState(false);

  useEffect(() => {
    if (!loadState.css)
      postscribe(
        "#player-xg-css",
        `<link rel="stylesheet" href="./lib/xg/index.min.css?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"/>`,
        {
          done: () => setLoadState((state) => ({ ...state, css: true })),
        }
      );
    if (!loadState.player)
      postscribe(
        "#player-xg",
        `<script src="./lib/xg/player.xg.js?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"></script>`,
        {
          done: () => setLoadState((state) => ({ ...state, player: true })),
        }
      );
    if (!loadState.flv)
      postscribe(
        "#player-xg-flv",
        `<script src="./lib/xg/xg.flv.js?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"></script>`,
        {
          done: () => setLoadState((state) => ({ ...state, flv: true })),
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadState.css || !loadState.player || !loadState.flv) return;

    const noCache = new Date().getTime(),
      noCacheUrl = () => `${props.url}?nocache=${noCache}`,
      player = new window.Player({
        id: elId,
        isLive: true,
        playsinline: true,
        url: noCacheUrl(),
        autoplay: true,
        height: undefined,
        width: undefined,
        plugins: [window.FlvPlayer],
        lang: "en",
        playbackRate: false,
        cssFullscreen: false,
        screenShot: true,
        pip: true,
      }),
      restartPlayback = () => {
        console.log("Attempting to restart playback.");
        setTriggerCacheUpdate((triggerCacheUpdate) => !triggerCacheUpdate);
      };

    player.on("error", restartPlayback);
    player.on("ended", restartPlayback);
    player.on("waiting", () => {
      clearTimeout(window.timeout);
      window.timeout = setTimeout(() => {
        try {
          if (player?.readyState <= 2) {
            restartPlayback();
          }
        } catch (e) {}
      }, 5000);
    });

    console.log(`XGPlayer initialized. noCache: ${noCache}`);

    return () => {
      player.destroy();
      console.log(`XGPlayer destroyed. noCache: ${noCache}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, props.url, triggerCacheUpdate]);

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
