import { red } from "@mui/material/colors";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const getFilenameWithoutExtension = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const filenameWithoutExtension = filename.split(".")[0];
  return filenameWithoutExtension;
};

const MultistreamPrompt = (props) => {
  const { primaryStreamUrl, secondaryStreamUrl } = props.configuration,
    sourceName = getFilenameWithoutExtension(props.useMultistreamSecondary ? primaryStreamUrl : secondaryStreamUrl),
    toggleSource = () => {
      const status = LocalStorageManager.toggleMultistreamStatus();
      props.setMultistreamSecondary(status);
    };

  return (
    <NotificationBar
      onClick={toggleSource}
      text={`Multistreams: click here to watch ${sourceName}`}
      icon={LiveTvIcon}
      palette={red}
      skipCloseButton={true}
    />
  );
};

export default MultistreamPrompt;
