import { indigo } from "@mui/material/colors";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, IconButton, Link, Tooltip } from "@mui/material";
import { keyframes } from "@mui/system";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,
  ContainerSx = {
    position: "relative",
    backgroundColor: indigo[700],
    display: "inline-flex",
    padding: "2px",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "-50%",
      background: `conic-gradient(from 0deg, transparent 0%, ${indigo[300]} 15%, transparent 30%)`,
      animation: `${spin} 2s linear infinite`,
    },
  },
  ButtonSx = {
    position: "relative",
    zIndex: 1,
    backgroundColor: indigo[700],
    borderRadius: "0px",
    height: "31px",
    width: "32px",
  };

const GithubPrompt = () => {
  return (
    <Tooltip title={"Open GitHub repository"} arrow>
      <Link href={"https://github.com/shrimpcast/shrimpcast"} target="_blank">
        <Box sx={ContainerSx}>
          <IconButton type="button" size="small" sx={ButtonSx}>
            <GitHubIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Link>
    </Tooltip>
  );
};

export default GithubPrompt;
