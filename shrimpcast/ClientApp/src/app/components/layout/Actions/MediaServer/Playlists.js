import MediaServerManager from "../../../../managers/MediaServerManager";
import GenericAddObjectTable from "../GenericAddObjectTable";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";

const Playlists = (props) => {
  const { signalR } = props,
    tableModel = {
      fields: [
        {
          name: "isEnabled",
          label: "Running status",
          type: 1,
          color: "success",
        },
        {
          name: "name",
          label: "Playlist name",
          type: 2,
        },
        {
          name: "ingressUri",
          label: "Media sources",
          type: 3,
          color: "info",
        },
        {
          name: "playlistPreset",
          label: "Source preset",
          type: 3,
          color: "warning",
        },
        {
          name: "playOnEnd",
          label: "Playlist on finish",
          type: 3,
          color: "success",
        },
        {
          name: "randomize",
          label: "Randomize",
          type: 1,
          color: "error",
        },
      ],
      requiredFields: ["name", "ingressUri"],
      reservedWords: [],
      reservedWordField: "name",
      model: {
        isEnabled: false,
        name: "",
        ingressUri: "",
        exitOnFail: false,
        videoStreamIndex: -1,
        videoEncodingPreset: "NONE_PLAYLIST",
        videoTranscodingBitrate: -1,
        videoTranscodingFramerate: -1,
        audioAACBitrate: -1,
        audioTranscodingVolume: -1,
        isPlaylist: true,
        playlistPreset: null,
        playOnEnd: null,
        randomize: false,
      },
      identifier: "name",
      itemsKey: "playlists",
      customActions: {
        add: MediaServerManager.Add,
        edit: MediaServerManager.Edit,
        remove: MediaServerManager.Remove,
      },
    },
    [items, setItems] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      const endpoints = await MediaServerManager.GetAll(signalR, true);
      setItems(endpoints);
    };
    setTimeout(getItems, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box mt={1} mb={1}>
      <Typography variant="overline">
        PLAYLISTS
        <Divider sx={{ mb: 1 }} />
      </Typography>
      {!items ? (
        <Box width="40px" ml="auto" mr="auto" mt={2}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <GenericAddObjectTable setItems={setItems} {...tableModel} items={items} signalR={signalR} />
      )}
    </Box>
  );
};

export default Playlists;
