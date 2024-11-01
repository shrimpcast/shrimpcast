import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import NotificationPrompt from "./Prompts/NotificationPrompt";
import GithubPrompt from "./Prompts/GithubPrompt";
import MultistreamPrompt from "./Prompts/MultistreamPrompt";

const BlockSx = {
    marginLeft: 3,
    marginRight: 5,
  },
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
  const {
      enableChristmasTheme,
      hideStreamTitle,
      streamDescription,
      enableMultistreams,
      streamEnabled,
      enableHalloweenTheme,
    } = props.configuration,
    streamTitle = hideStreamTitle ? null : props.configuration.streamTitle;

  return (
    <Grid width="100%" container>
      {streamEnabled && enableMultistreams && <MultistreamPrompt {...props} />}
      <NotificationPrompt {...props} />
      <GithubPrompt {...props} />
      <Grid>
        <Box sx={BlockSx}>
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
