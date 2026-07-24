import { indigo } from "@mui/material/colors";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, Link, Tooltip } from "@mui/material";

const GithubPrompt = () => {
  return (
    <Tooltip title={"Open GitHub repository"} arrow>
      <Link href={"https://github.com/shrimpcast/shrimpcast"} target="_blank">
        <IconButton type="button" size="small" sx={[{ backgroundColor: indigo[700], borderRadius: "0px" }]}>
          <GitHubIcon sx={{ color: "white" }} />
        </IconButton>
      </Link>
    </Tooltip>
  );
};

export default GithubPrompt;
