import Grid from "@mui/material/Unstable_Grid2";
import NotificationPrompt from "./Prompts/NotificationPrompt";
import GithubPrompt from "./Prompts/GithubPrompt";

const Prompts = (props) => {
  return (
    <Grid width="100%" container>
      <NotificationPrompt {...props} />
      <GithubPrompt {...props} />
    </Grid>
  );
};

export default Prompts;
