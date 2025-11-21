import MovieIcon from "@mui/icons-material/Movie";
import GenericActionList from "../GenericActionList";
import MediaServerManager from "../../../../managers/MediaServerManager";
import Probe from "./Probe";
import Panel from "./Panel";

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
        label: "Thumbnail interval",
        type: 6,
        color: "info",
      },
      {
        name: "watermark",
        label: "Watermark",
        type: 3,
        color: "success",
        requires: {
          field: "videoEncodingPreset",
          value: "H264",
          disabledTitle: "Enable H264 transcoding to set a watermark",
        },
      },
      {
        name: "subtitles",
        label: "Subtitles",
        type: 3,
        color: "success",
        requires: {
          field: "videoEncodingPreset",
          value: "H264",
          disabledTitle: "Enable H264 transcoding to set subtitles",
        },
      },
      {
        name: "startAt",
        label: "Start at (hh:mm:ss)",
        type: 3,
        color: "warning",
      },
      {
        name: "lowLatency",
        label: "Low latency",
        type: 1,
        color: "success",
      },
    ],
    requiredFields: ["name", "ingressUri", "probeSuccess", "segmentLength", "listSize", "snapshotInterval"],
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
      watermark: "",
      subtitles: "",
      startAt: null,
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
      title="Media server panel"
      getItems={MediaServerManager.GetAll}
      icon={MovieIcon}
      tableModel={tableModel}
      CustomHeaderComponent={<Panel {...props} />}
      customWidth="xl"
      showScroll={true}
      {...props}
    />
  );
};

export default MediaServer;
