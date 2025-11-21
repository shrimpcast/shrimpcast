import { CssBaseline } from "@mui/material";
import VideoJSPlayer from "./VideoJSPlayer";
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

      html5: {
        vhs: {
          withCredentials: false,
        },
      },
      poster: url?.includes("/streams/")
        ? url.substr(0, url.lastIndexOf(".")) + `.jpg?nocache=${Date.now()}`
        : undefined,
    },
    theme = makeTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VideoJSPlayer options={videoJsOptions} theme={theme} />
    </ThemeProvider>
  );
};

export default Embed;
