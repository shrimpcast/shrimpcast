import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@emotion/react";
import SiteTop from "./layout/SiteTop";
import Chat from "./chat/Chat";
import ShowFireworks from "./others/ShowFireworks";
import ShowSnow from "./others/ShowSnow";
import ShowPing from "./others/ShowPing";
import { useLocation } from "react-router-dom";
import BigScreen from "./player/BigScreen";

const MainGridSx = {
    overflow: "hidden",
    height: "100%",
    direction: "row",
    alignItems: "stretch",
  },
  PlayerBoxSx = (theme, useFullChatMode) => ({
    overflowY: "auto",
    height: "calc(100% - 35px)",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      height: `calc(${useFullChatMode ? 100 : 40}% - 35px)`,
    },
  }),
  ChatBoxSx = (theme, useFullChatMode, poppedOutChat) => ({
    height: "calc(100% - 35px)",
    backgroundColor: "primary.900",
    display: useFullChatMode && !poppedOutChat ? "none" : "block",
    [theme.breakpoints.down("md")]: {
      height: poppedOutChat ? "calc(100% - 35px)" : "60%",
    },
  }),
  HalloweenAnimSx = {
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0px",
      right: "0px",
      height: "160px",
      width: "160px",
      filter: "opacity(0.6)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100%",
      backgroundImage: 'url("../images/halloween-anim.gif")',
      pointerEvents: "none",
    },
  },
  PlayerContainerSx = (theme) => ({
    height: "100%",
    margin: "0 auto",
    width: "100%",
    backgroundColor: "#121212",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  });

const Layout = (props) => {
  const theme = useTheme(),
    { configuration, name } = props,
    [chatName, setChatName] = useState(name),
    location = useLocation(),
    sourceLocation = location.pathname?.replace("/", ""),
    poppedOutChat = sourceLocation === "chat",
    [useFullChatMode, setFullChatMode] = useState(poppedOutChat),
    [isNavigating, setNavigating] = useState(false),
    setNavigatingTrue = () => setNavigating(true),
    ResolveSources = () => {
      const { sources } = configuration,
        enabledSources = sources?.filter((source) => source.isEnabled),
        locationMatchesSource = enabledSources?.find(
          (source) => source.name.toLowerCase() === sourceLocation.toLowerCase(),
        ),
        isMultistreaming = enabledSources?.length > 1,
        source = locationMatchesSource
          ? locationMatchesSource
          : !isMultistreaming && enabledSources?.length
            ? enabledSources[0]
            : {},
        mustPickStream = isMultistreaming && !locationMatchesSource;

      const StreamStatus = {
        streamEnabled: configuration.streamEnabled && enabledSources?.length ? true : false,
        isMultistreaming: enabledSources?.length > 1,
        source,
        mustPickStream,
        sources: enabledSources,
      };

      return StreamStatus;
    },
    streamStatus = ResolveSources();

  useEffect(() => {
    document.addEventListener("navigationEvent", setNavigatingTrue);
    return () => document.removeEventListener("navigationEvent", setNavigatingTrue);
  }, []);

  useEffect(() => {
    setNavigating(false);
  }, [location]);

  return (
    <>
      <ShowFireworks {...props} />
      <ShowSnow {...props} />
      <ShowPing {...props} />
      <Grid container sx={MainGridSx}>
        <Grid xs={12}>
          <SiteTop
            {...props}
            useFullChatMode={useFullChatMode}
            poppedOutChat={poppedOutChat}
            setFullChatMode={setFullChatMode}
            chatName={chatName}
            setChatName={setChatName}
          />
        </Grid>

        {!poppedOutChat && (
          <Grid
            xs={12}
            md={useFullChatMode ? 12 : 8}
            lg={useFullChatMode ? 12 : 9}
            xl={useFullChatMode ? 12 : 10}
            sx={PlayerBoxSx(theme, useFullChatMode)}
            className={"scrollbar-custom"}
          >
            {isNavigating && <LinearProgress />}
            <Box sx={PlayerContainerSx}>
              <BigScreen streamStatus={streamStatus} {...props} />
            </Box>
          </Grid>
        )}

        <Grid
          xs={12}
          md={poppedOutChat ? 12 : 4}
          lg={poppedOutChat ? 12 : 3}
          xl={poppedOutChat ? 12 : 2}
          sx={[ChatBoxSx(theme, useFullChatMode, poppedOutChat), configuration.enableHalloweenTheme && HalloweenAnimSx]}
        >
          <Chat {...props} enabledSources={streamStatus.sources} chatName={chatName} />
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
