import { CssBaseline } from "@mui/material";
import VideoJSInstance from "./VideoJSInstance";
import makeTheme from "../../theme/makeTheme";
import { ThemeProvider } from "@emotion/react";
import { useLocation } from "react-router-dom";

const Embed = () => {
  const location = useLocation(),
    params = new URLSearchParams(location.search),
    url = params?.get("url"),
    autoplay = params?.get("autoplay") === "true",
    videoJsOptions = {
      autoplay: autoplay,
      controls: true,
      fill: true,
      playsinline: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
      userActions: { hotkeys: true },
      controlBar: {
        progressControl: false,
        currentTimeDisplay: false,
        durationDisplay: false,
        timeDivider: false,
      },
    },
    theme = makeTheme(),
    posterUrl = url?.includes("/streams/")
      ? url.substr(0, url.lastIndexOf(".")) + `.jpg?nocache=${Date.now()}`
      : undefined;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VideoJSInstance options={videoJsOptions} theme={theme} poster={posterUrl} />
    </ThemeProvider>
  );
};

export default Embed;
