import React from "react";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

const Mutes = (props) => {
  return (
    <GenericActionList
      title="Muted users"
      getItems={AdminActionsManager.GetActiveMutes}
      removeItem={ChatActionsManager.Unmute}
      icon={VolumeOffIcon}
      identifier="sessionId"
      contentIdentifier="sessionName"
      actionName="unmute"
      {...props}
    />
  );
};

export default Mutes;
