import { Box, Typography, alpha } from "@mui/material";
import { Link } from "react-router-dom";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { useEffect, useState } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SignalRManager from "../../../../managers/SignalRManager";

const DEFAULT_THUMBNAIL = "/images/video_thumbnail.png",
  ContainerSx = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    p: 2,
    bgcolor: "background.paper",
    borderRadius: 1,
    boxShadow: 3,
  },
  SourceSx = (hoveredIndex, index) => ({
    flex: 1,
    position: "relative",
    borderRadius: 1,
    overflow: "hidden",
    boxShadow: hoveredIndex === index ? 4 : 2,
    transition: "all 0.3s ease",
    transform: hoveredIndex === index ? "scale(1.01)" : "scale(1)",
    opacity: hoveredIndex === index ? 1 : 0.95,
  }),
  ImageSx = (thumbnail, hoveredIndex, index) => ({
    width: "100%",
    height: "100%",
    backgroundImage: `url(${thumbnail || DEFAULT_THUMBNAIL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    transition: "transform 0.5s ease",
    transform: hoveredIndex === index ? "scale(1.01)" : "scale(1)",
  }),
  HoverSx = (hoveredIndex, index) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(0deg, ${alpha("#000", 0.8)} 0%, ${alpha("#000", 0.4)} 50%, ${alpha(
      "#000",
      0.2
    )} 100%)`,
    opacity: hoveredIndex === index ? 0.8 : 0.6,
    transition: "opacity 0.3s ease",
    zIndex: 1,
  }),
  TextContainerSx = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 2,
  },
  TextSx = (hoveredIndex, index, mbXs) => ({
    fontSize: { xs: "20px", sm: "24px", md: "32px", lg: "48px" },
    color: "white",
    fontWeight: 700,
    textTransform: "uppercase",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.75px",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.6)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    opacity: hoveredIndex === index ? 1 : 0.8,
    lineHeight: 0.8,
    ml: { xs: 1, sm: 1, md: 1, lg: 2 },
    mb: { xs: mbXs, sm: mbXs, md: 1, lg: 2 },
  }),
  PlayButtonSx = (hoveredIndex, index) => ({
    fontSize: 48,
    color: "white",
    opacity: hoveredIndex === index ? 1 : 0,
    transition: "all 0.3s ease",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    webkitTransform: "translate(-50%, -50%)",
    textAlign: "center",
  }),
  ViewerCountSx = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "info.main",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
      "0%": {
        opacity: 1,
      },
      "50%": {
        opacity: 0.7,
      },
      "100%": {
        opacity: 1,
      },
    },
  };

const PickSource = ({ sources, signalR }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null),
    [viewerCount, setViewerCount] = useState(null);

  useEffect(() => {
    signalR.on(SignalRManager.events.sourceViewerCountChange, (viewerCount) => setViewerCount(viewerCount));
    return () => {
      signalR.off(SignalRManager.events.sourceViewerCountChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={ContainerSx}>
      {sources.map((source, index) => (
        <Box
          key={source.name}
          sx={SourceSx(hoveredIndex, index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchStart={() => setHoveredIndex(index)}
          onTouchEnd={() => setHoveredIndex(null)}
        >
          <Link
            to={`/${source.name.toLowerCase()}`}
            style={{
              textDecoration: "none",
              display: "block",
              height: "100%",
              position: "relative",
            }}
          >
            <Box sx={ViewerCountSx}>
              <PeopleAltIcon sx={{ width: "12px", height: "12px" }} />
              {viewerCount?.find((s) => s.name === source.name)?.count}
            </Box>
            <Box sx={ImageSx(source.thumbnail, hoveredIndex, index)}>
              <Box sx={HoverSx(hoveredIndex, index)} />
              <Box sx={TextContainerSx}>
                <Typography
                  sx={TextSx(
                    hoveredIndex,
                    index,
                    // This sucks and should certainly be improved
                    sources.length > 6 ? 0 : sources.length === 6 ? 0.3 : sources.length === 5 ? 0.5 : 1
                  )}
                >
                  {source.title ? source.title.trim() : source.name}
                </Typography>
              </Box>
              <PlayCircleFilledIcon sx={PlayButtonSx(hoveredIndex, index)} />
            </Box>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default PickSource;
