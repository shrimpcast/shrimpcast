import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useState } from "react";
import GenericActionList from "../Actions/GenericActionList";
import { useNavigate } from "react-router-dom";

const MultistreamPrompt = ({ streamStatus, goHomeOnStreamSwitch }) => {
  const [openSwitchSource, setSwitchSource] = useState(false),
    navigate = useNavigate(),
    switchStreams = () => {
      if (goHomeOnStreamSwitch) {
        navigate("/");
      } else {
        setSwitchSource(true);
      }
    };

  return (
    <>
      <NotificationBar
        onClick={switchStreams}
        text={`Multistreams: click to switch streams`}
        icon={LiveTvIcon}
        palette={red}
        skipCloseButton={true}
      />
      {openSwitchSource && (
        <GenericActionList
          skipButton={true}
          title="Active streams"
          getItems={() => streamStatus.sources}
          contentIdentifier="name"
          imageIdentifier="thumbnail"
          identifier="sourceId"
          closeCallback={() => setSwitchSource(false)}
          useLinks={true}
          skipFullWidth={true}
        />
      )}
    </>
  );
};

export default MultistreamPrompt;
