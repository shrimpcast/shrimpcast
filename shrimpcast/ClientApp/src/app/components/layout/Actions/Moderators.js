import React from "react";
import SecurityIcon from "@mui/icons-material/Security";
import GenericActionList from "./GenericActionList";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";

const Moderators = (props) => {
  return (
    <GenericActionList
      title="Moderators"
      getItems={AdminActionsManager.ListMods}
      removeItem={ChatActionsManager.ToggleModStatus}
      icon={SecurityIcon}
      identifier="sessionId"
      contentIdentifier="sessionName"
      {...props}
    />
  );
};

export default Moderators;
