import Grid from "@mui/material/Unstable_Grid2";
import NotificationPrompt from "./Prompts/NotificationPrompt";
import GithubPrompt from "./Prompts/GithubPrompt";
import MultistreamPrompt from "./Prompts/MultistreamPrompt";

const Prompts = (props) => {
  const { streamEnabled, isMultistreaming, mustPickStream } = props.streamStatus;

  return (
    <Grid width="100%" container>
      {streamEnabled && isMultistreaming && !mustPickStream && <MultistreamPrompt streamStatus={props.streamStatus} />}
      <NotificationPrompt {...props} />
      <GithubPrompt {...props} />
    </Grid>
  );
};

export default Prompts;
