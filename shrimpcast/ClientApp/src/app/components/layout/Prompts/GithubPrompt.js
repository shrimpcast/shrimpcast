import { indigo } from "@mui/material/colors";
import { useState } from "react";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import NotificationBar from "./NotificationBar";
import GitHubIcon from "@mui/icons-material/GitHub";

const GithubPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(LocalStorageManager.shouldShowGitHubPrompt()),
    hidePrompt = () => {
      LocalStorageManager.hideGitHubPrompt();
      setShowPrompt(false);
    },
    openRepository = () => window.open("https://github.com/shrimpcast/shrimpcast", "_blank");

  return showPrompt ? (
    <NotificationBar
      onClick={openRepository}
      close={hidePrompt}
      text="Shrimpcast is open source. Check it out on GitHub"
      icon={GitHubIcon}
      palette={indigo}
    />
  ) : null;
};

export default GithubPrompt;
