import { useRef, useState } from "react";
import { Box, Typography, Button, useMediaQuery, Tooltip, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PickSource from "../Actions/Sources/PickSource";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Joyride, STATUS } from "react-joyride";
import LocalStorageManager from "../../../managers/LocalStorageManager";

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
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
    [theme.breakpoints.down("md")]: {
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      borderBottomLeftRadius: "0px",
    },
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
  }),
  TooltipSlotPropts = (isMobile) => ({
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
  }),
  JoyrideOptions = {
    dismissKeyAction: false,
    disableFocusTrap: true,
    overlayClickAction: false,
    skipScroll: true,
    skipBeacon: true,
    buttons: ["primary"],
    backgroundColor: "#333333",
    textColor: "#ffffff",
    primaryColor: "#ffffff",
    arrowColor: "#333333",
    overlayColor: "rgba(0, 0, 0, 0.7)",
  };

const MultistreamPrompt = (props) => {
  const [show, setShow] = useState(false),
    toggleShow = () => setShow((show) => !show),
    theme = useTheme(),
    isMobile = useMediaQuery(theme.breakpoints.down("md")),
    lateralBarReference = useRef(),
    showTutorial = !LocalStorageManager.getPassedTutorial(),
    handleJoyrideEvent = (data) => {
      const { status } = data;
      if (STATUS.FINISHED === status) {
        LocalStorageManager.setPassedTutorial();
      }
    };

  return (
    <>
      <Slide direction={isMobile ? "up" : "left"} in={show} mountOnEnter unmountOnExit>
        <Box sx={PickSourceContainerSx(show, theme)}>
          <PickSource onClick={toggleShow} noCache={Date.now()} {...props} />
        </Box>
      </Slide>
      <Tooltip
        disableInteractive
        title={show ? "Hide streams" : "Show streams"}
        placement={isMobile ? "top" : "right"}
        slotProps={TooltipSlotPropts(isMobile)}
      >
        <Box ref={lateralBarReference} sx={LateralBarSx}>
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

      {showTutorial && (
        <Joyride
          run={true}
          steps={[
            {
              content: "Use this button to switch between all available streams",
              placement: isMobile ? "top" : "left",
              target: () => lateralBarReference.current,
            },
          ]}
          onEvent={handleJoyrideEvent}
          options={JoyrideOptions}
          portalElement={document.getElementById("root")}
          locale={{
            close: "Understood",
          }}
        />
      )}
    </>
  );
};

export default MultistreamPrompt;
