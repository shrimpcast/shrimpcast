import { red } from "@mui/material/colors";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const getNameWithoutExtension = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const filenameWithoutExtension = filename.split(".")[0];
  return filenameWithoutExtension;
};

const MultistreamPrompt = (props) => {
  const { configuration, useMultistreamSecondary } = props,
    { primaryStreamUrl, secondaryStreamUrl, primaryUrlName, secondaryUrlName } = configuration,
    rawUrlName = getNameWithoutExtension(useMultistreamSecondary ? primaryStreamUrl : secondaryStreamUrl),
    sourceName = useMultistreamSecondary ? primaryUrlName || rawUrlName : secondaryUrlName || rawUrlName,
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
