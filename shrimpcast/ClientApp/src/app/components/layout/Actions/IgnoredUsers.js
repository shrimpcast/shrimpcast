import React from "react";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LocalStorageManager from "../../../managers/LocalStorageManager";

const IgnoredUsers = (props) => {
  return (
    <GenericActionList
      title="Ignored users"
      getItems={() => LocalStorageManager.getIgnoredUsers()}
      removeItem={ChatActionsManager.Unignore}
      icon={VisibilityOffIcon}
      identifier="sessionId"
      contentIdentifier="n"
      {...props}
    />
  );
};

export default IgnoredUsers;
