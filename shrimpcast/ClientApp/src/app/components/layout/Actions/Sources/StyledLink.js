import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ButtonSx = (backgroundUrl) => ({
    display: "inline-flex",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "primary.main",
    borderColor: "primary.main",
    transition: "all 0.3s ease",
    width: "100%",
    maxWidth: "300px",
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    "&:hover": {
      backgroundColor: "primary.main",
      color: "white",
      borderColor: "primary.dark",
    },
    "&:focus": {
      outline: "none",
    },
  }),
  TextContainerSx = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row-reverse",
    backgroundColor: "primary.700",
    padding: "5px",
    borderRadius: "10px",
  };

const StyledLink = ({ content, setClosed, backgroundUrl }) => {
  return (
    <Link to={`/${content.toLowerCase()}`} onClick={setClosed} style={{ textDecoration: "none" }}>
      <Button variant="outlined" sx={ButtonSx(backgroundUrl)}>
        <Box sx={TextContainerSx}>
          <PlayArrowIcon sx={{ color: "primary.main" }} />
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "primary.300" }}>
            Click to watch {content}
          </Typography>
        </Box>
      </Button>
    </Link>
  );
};

export default StyledLink;
