import BlockIcon from "@mui/icons-material/Block";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";

const Bans = (props) => {
  return (
    <GenericActionList
      title="Banned users"
      getItems={AdminActionsManager.GetBans}
      removeItem={ChatActionsManager.Unban}
      icon={BlockIcon}
      identifier="banId"
      contentIdentifier="sessionName"
      showScroll={true}
      responseIsTitleObject={{
        appendTitle: "[{0} banned user(s)]",
        appendKey: "totalBans",
        value: "bans",
      }}
      {...props}
    />
  );
};

export default Bans;
