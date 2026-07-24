import { useState } from "react";
import { Box, Typography, Button, useMediaQuery, Tooltip, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PickSource from "../Actions/Sources/PickSource";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LateralBarSx = (theme) => ({
    width: "20px",
    height: "100%",
    borderRadius: "0px",
    zIndex: 2,
    position: "relative",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "20px",
    },
  }),
  ButtonSx = (theme) => ({
    width: "100%",
    height: "100%",
    borderRadius: "0px",
    backgroundColor: "#121212",
    "&:hover": {
      backgroundColor: "primary.900",
    },
    display: "block",
  }),
  ButtonTextSx = (theme) => ({
    fontSize: "12px",
    fontWeight: "bold",
    color: "secondary.main",
    position: "absolute",
    left: "-2.5px",
    [theme.breakpoints.down("md")]: {
      position: "relative",
      bottom: "9.5px",
      textAlign: "center",
    },
  }),
  PickSourceContainerSx = (show, theme) => ({
    width: "calc(100% - 20px)",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "calc(100% - 20px)",
    },
  });

const MultistreamPrompt = (props) => {
  const [show, setShow] = useState(false),
    toggleShow = () => setShow((show) => !show),
    theme = useTheme(),
    isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Slide direction={isMobile ? "up" : "left"} in={show} mountOnEnter unmountOnExit>
        <Box sx={PickSourceContainerSx(show, theme)}>
          <PickSource onClick={toggleShow} {...props} />
        </Box>
      </Slide>
      <Tooltip
        title={show ? "Hide streams" : "Show streams"}
        placement={isMobile ? "top" : "right"}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [isMobile ? -5 : 12, -12],
                },
              },
            ],
          },
        }}
      >
        <Box sx={LateralBarSx}>
          <Button sx={ButtonSx} onClick={toggleShow} size="large" variant="contained">
            <Typography sx={ButtonTextSx}>
              {!show ? (
                isMobile ? (
                  <ExpandLessIcon />
                ) : (
                  <ChevronLeftIcon />
                )
              ) : isMobile ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </Typography>
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default MultistreamPrompt;
