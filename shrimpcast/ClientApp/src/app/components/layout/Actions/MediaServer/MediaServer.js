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
      },
      {
        name: "ingressUri",
        label: "Ingress URL",
        type: 3,
        color: "info",
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
      {
        name: "hlsVersion",
        label: "HLS version",
        type: 6,
        color: "error",
      },
      {
        name: "segmentLength",
        label: "HLS segment length",
        type: 6,
        color: "warning",
      },
      {
        name: "listSize",
        label: "HLS list size",
        type: 6,
        color: "warning",
      },
      {
        name: "snapshotInterval",
        label: "Snapshot interval",
        type: 6,
        color: "info",
      },
      {
        name: "lowLatency",
        label: "Low latency",
        type: 1,
        color: "success",
      },
    ],
    requiredFields: ["name", "ingressUri", "probeSuccess"],
    reservedWords: [],
    reservedWordField: "name",
    model: {
      isEnabled: false,
      name: "",
      ingressUri: "",
      hlsVersion: 3,
      segmentLength: 2,
      listSize: 6,
      snapshotInterval: 60,
      lowLatency: true,
    },
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
      title="Media server streams"
      getItems={MediaServerManager.GetAll}
      icon={TheatersIcon}
      tableModel={tableModel}
      CustomHeaderComponent={<SystemStats {...props} />}
      customWidth="xl"
      {...props}
    />
  );
};

export default MediaServer;
