import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import { Box, CircularProgress } from "@mui/material";
import LocalStorageManager from "../../managers/LocalStorageManager";

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const InitialPlayerState = {
  waiting: null,
  requireRestart: false,
  paused: false,
};

const VideoJSInstance = (props) => {
  const { options, theme, poster } = props,
    videoRef = useRef(null),
    playerRef = useRef(null),
    [cssLoaded, setCssLoaded] = useState(false),
    [playerInitialized, setPlayerInitialized] = useState(false),
    [shouldSetOptions, setShouldSetOptions] = useState(false),
    [, setPlayerErrorState] = useState(InitialPlayerState);

  const onVolumeChange = () => {
      const player = playerRef.current;
      const currentVolume = player.volume();
      LocalStorageManager.setPlayerVolume(currentVolume);
    },
    onRequireRestart = () =>
      setPlayerErrorState((playerErrorState) => ({ ...InitialPlayerState, requireRestart: true })),
    onWaiting = () => setPlayerErrorState((playerErrorState) => ({ ...InitialPlayerState, waiting: Date.now() })),
    onPause = () => {
      const player = playerRef.current;
      player.removeClass("vjs-waiting");
      player.removeClass("vjs-seeking");
      setPlayerErrorState((playerErrorState) => ({ ...playerErrorState, paused: true }));
    },
    onPlay = () => setPlayerErrorState((playerErrorState) => ({ ...playerErrorState, paused: false }));

  const watchForPlayerEvents = () =>
    setPlayerErrorState((playerErrorState) => {
      if (playerErrorState.requireRestart) {
        console.log(`[${playerInitialized}] playback error. Attempting restart.`);
        setPlayerOptions();
        return InitialPlayerState;
      }

      if (playerErrorState.waiting) {
        const elapsedSeconds = (Date.now() - playerErrorState.waiting) / 1000;
        if (elapsedSeconds < 4.2) return playerErrorState;

        const player = playerRef.current;
        if (player.readyState() <= 2) {
          console.log(
            `[${playerInitialized}] elapsed ${elapsedSeconds} seconds of waiting. ${!playerErrorState.paused ? "Atempting restart..." : ""} `,
          );

          if (!playerErrorState.paused) {
            setPlayerOptions();
          }
        }
        return InitialPlayerState;
      }

      return playerErrorState;
    });

  const addPlayerHandlers = () => {
      const player = playerRef.current;
      player.on("error", onRequireRestart);
      player.on("ended", onRequireRestart);
      player.on("waiting", onWaiting);
      player.on("volumechange", onVolumeChange);
      player.on("pause", onPause);
      player.on("play", onPlay);
      window[playerInitialized] = setInterval(watchForPlayerEvents, 1700);
    },
    removePlayerHandlers = () => {
      const player = playerRef.current;
      player.off("error", onRequireRestart);
      player.off("ended", onRequireRestart);
      player.off("waiting", onWaiting);
      player.off("volumechange", onVolumeChange);
      player.off("pause", onPause);
      player.off("play", onPlay);
      clearInterval(window[playerInitialized]);
      delete window[playerInitialized];
    },
    setPlayerOptions = () => {
      const player = playerRef.current;
      player.pause();
      player.src(options.sources);
      player.play().catch((ex) => ex);
    },
    setMiscPlayerOptions = () => {
      const player = playerRef.current;
      player.el().style.color = theme.palette.secondary[500];
      setPlayerPoster();
    },
    setPlayerPoster = () => {
      const player = playerRef.current;
      player.poster(null);
      player.poster(poster);
      const posterImg = player.el().querySelector(".vjs-poster img");
      if (!posterImg) return;
      posterImg.style.visibility = "hidden";
      posterImg.onload = () => (posterImg.style.visibility = "visible");
      if (posterImg.complete && posterImg.naturalWidth > 0) {
        posterImg.style.visibility = "visible";
      }
    };

  const doAutoplay = () => {
    const player = playerRef.current;
    console.log("Attempting to autoplay..");
    player.muted(false);
    player.play().catch((ex) => {
      if (player.isDisposed()) return;
      player.muted(true);
      player.play().catch((ex) => console.log(ex));
    });
  };

  const initPlayerInstance = (playerId) => {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("skin_slate");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        player.volume(LocalStorageManager.getPlayerVolume());
        if (options.autoplay) {
          doAutoplay();
        }

        setPlayerInitialized(playerId);
        console.log(`Player initialized [${playerId}]`);
      }));
    },
    disposePlayerInstance = (playerId) => {
      playerRef.current.dispose();
      setShouldSetOptions(false);
      setPlayerInitialized(false);
      setPlayerErrorState(InitialPlayerState);
      console.log(`Player disposed [${playerId}]`);
    };

  // Initial load
  useEffect(() => {
    const importCSS = async (abortSignal) => {
      if (cssLoaded || abortSignal.aborted) return;
      try {
        await import("video.js/dist/video-js.css");
        await import("./css/videojs-skin.css");
      } catch (e) {
        console.log(e);
        setTimeout(() => importCSS(abortSignal), 1000);
        return;
      }
      setCssLoaded(true);
    };
    const abortController = new AbortController();
    importCSS(abortController.signal);
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Player initialization
  useEffect(() => {
    if (!cssLoaded) return;
    const playerId = `__vjs_player_${Date.now()}`;
    initPlayerInstance(playerId);
    return () => disposePlayerInstance(playerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssLoaded]);

  // Listen for changes in options that require a player restart
  useEffect(() => {
    if (!playerInitialized) return;
    addPlayerHandlers();
    if (options.autoplay || shouldSetOptions) setPlayerOptions();
    else setShouldSetOptions(true);
    return () => removePlayerHandlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerInitialized, options]);

  // Listen for changes in options that do not require a player restart
  useEffect(() => {
    if (!playerInitialized) return;
    setMiscPlayerOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerInitialized, poster, theme.palette.secondary]);

  return (
    <>
      {!cssLoaded ? (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      ) : (
        <div data-vjs-player className="full-height">
          <div ref={videoRef} className="full-height" />
        </div>
      )}
    </>
  );
};

export default VideoJSInstance;
