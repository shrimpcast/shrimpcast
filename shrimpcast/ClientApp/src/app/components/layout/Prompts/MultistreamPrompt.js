import { useState } from "react";
import { Box, Typography, Button, useMediaQuery, Tooltip } from "@mui/material";
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
    transform: show ? "translateX(0)" : "translateX(100%)",
    transition: "transform 250ms ease-in-out",
    willChange: "transform",
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "calc(100% - 20px)",
      transform: show ? "translateY(0)" : "translateY(100%)",
      top: 0,
    },
  });

const MultistreamPrompt = (props) => {
  const [show, setShow] = useState(false),
    toggleShow = () => setShow((show) => !show),
    theme = useTheme(),
    isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={PickSourceContainerSx(show, theme)}>
        <PickSource onClick={toggleShow} {...props} />
      </Box>
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
