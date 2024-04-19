import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import NotificationPrompt from "./Prompts/NotificationPrompt";
import GithubPrompt from "./Prompts/GithubPrompt";

const BlockSx = {
    marginLeft: 3,
    marginRight: 5,
  },
  TitleSx = {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  DescriptionSx = {
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: 0.25,
    fontSize: "1.1rem",
    lineHeight: 1.6,
  };

const SiteDetails = (props) => {
  const { configuration } = props,
    showRightSide = false;

  return (
    <Grid width="100%" container>
      <NotificationPrompt {...props} />
      <GithubPrompt {...props} />
      <Grid xs={12} md={showRightSide ? 7 : 12}>
        <Box sx={BlockSx}>
          <Box sx={{ wordBreak: "break-word" }}>
            <Typography
              color="secondary.main"
              className={configuration.enableChristmasTheme ? "santa-hat-primary" : null}
              variant="h3"
              sx={TitleSx}
            >
              {configuration.streamTitle}
            </Typography>
            <Typography color="secondary.main" sx={DescriptionSx}>
              {configuration.streamDescription}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {showRightSide && <Grid xs={12} md={5}></Grid>}
    </Grid>
  );
};

export default SiteDetails;
