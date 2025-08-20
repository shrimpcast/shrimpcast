import { Box } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@emotion/react";
import SitePlayer from "./player/SitePlayer";
import SiteDetails from "./layout/SiteDetails";
import SiteTop from "./layout/SiteTop";
import Chat from "./chat/Chat";
import ShowFireworks from "./others/ShowFireworks";
import ShowSnow from "./others/ShowSnow";
import ShowPing from "./others/ShowPing";
import { useLocation } from "react-router-dom";

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
      height: useFullChatMode ? "calc(100% - 35px)" : "60%",
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
  PlayerContainerSx = {
    height: "100%",
    margin: "0 auto",
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "#121212",
    overflow: "hidden",
  },
  SiteDetailsSx = {
    backgroundColor: "primary.900",
    display: "flex",
    flex: 1,
    alignItems: "center",
  };

const Layout = (props) => {
  const theme = useTheme(),
    { configuration, name } = props,
    [chatName, setChatName] = useState(name),
    location = useLocation(),
    sourceLocation = location.pathname?.replace("/", ""),
    poppedOutChat = sourceLocation === "chat",
    [useFullChatMode, setFullChatMode] = useState(poppedOutChat),
    ResolveSources = () => {
      const { sources } = configuration,
        enabledSources = sources.filter((source) => source.isEnabled),
        locationMatchesSource = enabledSources.find(
          (source) => source.name.toLowerCase() === sourceLocation.toLowerCase()
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
            <Box sx={PlayerContainerSx}>
              <SitePlayer streamStatus={streamStatus} {...props} />
            </Box>
            <Box sx={SiteDetailsSx}>
              <SiteDetails {...props} streamStatus={streamStatus} />
            </Box>
          </Grid>
        )}

        <Grid
          xs={12}
          md={useFullChatMode ? 12 : 4}
          lg={useFullChatMode ? 12 : 3}
          xl={useFullChatMode ? 12 : 2}
          sx={[ChatBoxSx(theme, useFullChatMode, poppedOutChat), configuration.enableHalloweenTheme && HalloweenAnimSx]}
        >
          <Chat {...props} enabledSources={streamStatus.sources} chatName={chatName} />
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
