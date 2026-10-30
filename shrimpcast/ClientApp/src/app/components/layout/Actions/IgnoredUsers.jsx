import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";
import { VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
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
      actionName="unignore"
      {...props}
    />
  );
};

export default IgnoredUsers;
