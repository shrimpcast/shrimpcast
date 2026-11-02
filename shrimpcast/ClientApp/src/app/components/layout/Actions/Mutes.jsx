import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";
import { VolumeOff as VolumeOffIcon } from "@mui/icons-material";

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
      responseIsTitleObject={{
        appendTitle: "{0} muted user(s)",
        appendKey: "totalMutes",
        value: "activeMutes",
      }}
      maxLength={120}
      showScroll={true}
      {...props}
    />
  );
};

export default Mutes;
