import MediaServerManager from "../../../../managers/MediaServerManager";
import GenericAddObjectTable from "../GenericAddObjectTable";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";

const GenerateUUID = () =>
  "xy".repeat(10).replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const RTMPEndpoints = (props) => {
  const { signalR } = props,
    tableModel = {
      fields: [
        {
          name: "name",
          label: "Name",
          type: 2,
        },
        {
          name: "ingressUrl",
          label: "Ingress URL",
          type: 2,
          readOnly: true,
        },
        {
          name: "publishKey",
          label: "Stream key",
          type: 2,
        },
        {
          name: "egressUrl",
          label: "Egress URL",
          type: 2,
          readOnly: true,
        },
      ],
      requiredFields: ["name", "publishKey"],
      reservedWords: [],
      reservedWordField: "name",
      model: {
        publishKey: GenerateUUID(),
        name: "",
      },
      identifier: "name",
      itemsKey: "rtmp endpoints",
      customActions: {
        add: MediaServerManager.AddEndpoint,
        edit: MediaServerManager.EditEndpoint,
        remove: MediaServerManager.RemoveEndpoint,
      },
    },
    [items, setItems] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      const endpoints = await MediaServerManager.GetAllEndpoints(signalR);
      setItems(endpoints);
    };
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="overline" mt={1} mb={1}>
        RTMP ENDPOINTS
        <Divider />
      </Typography>
      {!items ? (
        <Box width="40px" ml="auto" mr="auto" mt={1}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <GenericAddObjectTable setItems={setItems} {...tableModel} items={items} signalR={signalR} />
      )}
    </>
  );
};

export default RTMPEndpoints;
