import { Box, Typography, alpha } from "@mui/material";
import { Link } from "react-router-dom";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { useState } from "react";

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
    ml: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  TextSx = (hoveredIndex, index) => ({
    fontSize: { xs: "23px", sm: "26px", md: "30px" },
    color: "white",
    fontWeight: 600,
    textTransform: "uppercase",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.5px",
    transform: hoveredIndex === index ? "translateY(0)" : "translateY(5px)",
    transition: "transform 0.3s ease",
  }),
  PlayButtonSx = (hoveredIndex, index) => ({
    fontSize: 48,
    color: "white",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.3))",
    opacity: hoveredIndex === index ? 1 : 0,
    transform: hoveredIndex === index ? "scale(1)" : "scale(0.8)",
    transition: "all 0.3s ease",
    mr: 2,
  });

const PickSource = ({ sources }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Box sx={ContainerSx}>
      {sources.map((source, index) => (
        <Box
          key={source.name}
          sx={SourceSx(hoveredIndex, index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Link
            to={`/${source.name.toLowerCase()}`}
            style={{
              textDecoration: "none",
              display: "block",
              height: "100%",
            }}
          >
            <Box sx={ImageSx(source.thumbnail, hoveredIndex, index)}>
              <Box sx={HoverSx(hoveredIndex, index)} />
              <Box sx={TextContainerSx}>
                <Typography sx={TextSx(hoveredIndex, index)}>{source.name}</Typography>
                <PlayCircleFilledIcon sx={PlayButtonSx(hoveredIndex, index)} />
              </Box>
            </Box>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default PickSource;
