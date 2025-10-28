import TheatersIcon from "@mui/icons-material/Theaters";
import GenericActionList from "../GenericActionList";
import SystemStats from "./SystemStats";
import MediaServerManager from "../../../../managers/MediaServerManager";
import Probe from "./Probe";

const MediaServer = (props) => {
  const tableModel = {
    fields: [
      {
        name: "isEnabled",
        label: "Enabled",
        type: 1,
        color: "success",
      },
      {
        name: "name",
        label: "Name",
        type: 2,
        color: "success",
      },
      {
        name: "ingressUri",
        label: "Ingress URL",
        type: 3,
        color: "success",
        probe: Probe,
        enableProbeCondition: (url) => {
          try {
            return new URL(url);
          } catch (e) {}
        },
        probeSuccess: {
          key: "probeSuccess",
          value: true,
        },
      },
    ],
    requiredFields: ["name", "ingressUri", "probeSuccess"],
    reservedWords: [],
    reservedWordField: "name",
    model: { isEnabled: false, name: "", ingressUri: "" },
    identifier: "name",
    itemsKey: "media server streams",
    customActions: {
      add: MediaServerManager.Add,
      edit: MediaServerManager.Edit,
      remove: MediaServerManager.Remove,
    },
  };

  return (
    <GenericActionList
      title="Media server settings"
      getItems={MediaServerManager.GetAll}
      icon={TheatersIcon}
      tableModel={tableModel}
      CustomHeaderComponent={<SystemStats {...props} />}
      customWidth="lg"
      {...props}
    />
  );
};

export default MediaServer;
