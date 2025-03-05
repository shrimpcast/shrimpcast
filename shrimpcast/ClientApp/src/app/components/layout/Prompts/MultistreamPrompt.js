import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useState } from "react";
import GenericActionList from "../Actions/GenericActionList";

const MultistreamPrompt = ({ streamStatus }) => {
  const [openSwitchSource, setSwitchSource] = useState(false);

  return (
    <>
      <NotificationBar
        onClick={() => setSwitchSource(true)}
        text={`Multistreams: click  to switch streams`}
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
