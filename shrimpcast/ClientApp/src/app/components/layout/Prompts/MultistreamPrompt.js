import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MultistreamPrompt = () => {
  const navigate = useNavigate(),
    switchStreams = () => navigate("/"),
    [show, setShow] = useState(true),
    close = () => setShow(false);

  return show ? (
    <NotificationBar
      onClick={switchStreams}
      text={`Multistreams: click to switch streams`}
      icon={LiveTvIcon}
      palette={red}
      close={close}
    />
  ) : null;
};

export default MultistreamPrompt;
