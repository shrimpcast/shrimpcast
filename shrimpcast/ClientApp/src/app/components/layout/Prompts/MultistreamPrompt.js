import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useNavigate } from "react-router-dom";

const MultistreamPrompt = () => {
  const navigate = useNavigate(),
    switchStreams = () => navigate("/");

  return (
    <NotificationBar
      onClick={switchStreams}
      text={`Multistreams: click to switch streams`}
      icon={LiveTvIcon}
      palette={red}
      skipCloseButton={true}
    />
  );
};

export default MultistreamPrompt;
