import { Box, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import NotificationPrompt from "./Prompts/NotificationPrompt";
import GithubPrompt from "./Prompts/GithubPrompt";
import MultistreamPrompt from "./Prompts/MultistreamPrompt";

const BlockSx = (theme) => ({
    marginLeft: 3,
    marginRight: 5,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }),
  TitleSx = {
    fontFamily: "Roboto, sans-serif",
    fontSize: "3rem",
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    "&::first-letter": {
      textTransform: "uppercase",
    },
  },
  DescriptionSx = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "1.1rem",
    letterSpacing: 0.25,
    lineHeight: 1.6,
  };

const SiteDetails = (props) => {
  const { enableChristmasTheme, hideStreamTitle, streamDescription, enableHalloweenTheme } = props.configuration,
    { streamEnabled, isMultistreaming, mustPickStream } = props.streamStatus,
    streamTitle = hideStreamTitle ? null : props.configuration.streamTitle,
    theme = useTheme();

  return (
    <Grid width="100%" container>
      {streamEnabled && isMultistreaming && !mustPickStream && <MultistreamPrompt streamStatus={props.streamStatus} />}
      <NotificationPrompt {...props} />
      <GithubPrompt {...props} />
      <Grid>
        <Box sx={BlockSx(theme)}>
          <Box sx={{ wordBreak: "break-word" }}>
            <Typography
              color="secondary.main"
              className={`neon-text ${
                streamTitle
                  ? enableChristmasTheme
                    ? "santa-hat-primary"
                    : enableHalloweenTheme
                    ? "halloween-hat-primary"
                    : null
                  : null
              }`}
              sx={TitleSx}
            >
              {streamTitle}
            </Typography>
            <Typography className="neon-text" color="secondary.main" sx={DescriptionSx}>
              {streamDescription}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SiteDetails;
