import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { isIP } from "is-ip";
import { Divider, Link, Typography } from "@mui/material";
import { Virtuoso } from "react-virtuoso";

const ListSx = {
    bgcolor: "background.paper",
    borderRadius: "5px",
    mt: "2.5px",
  },
  RowSx = {
    wordBreak: "break-all",
    overflow: "hidden",
    width: "100%",
  };

const RemoteAddressLink = ({ value, isUA }) => {
  const service = isUA
    ? `https://gs.statcounter.com/detect?useragent=${encodeURIComponent(value)}`
    : `https://whatismyipaddress.com/ip/${value}`;
  return (
    <Link href={service} target="_blank">
      {value}
    </Link>
  );
};

const ListItem = ({ children }) => {
  return (
    <ListItemButton sx={RowSx}>
      <ListItemText>{children}</ListItemText>
    </ListItemButton>
  );
};

const SimpleRow = (index, value) => {
  return <ListItem key={index}> {isIP(value) ? <RemoteAddressLink value={value} /> : value} </ListItem>;
};

const ComplexRow = (index, value) => {
  const values = value.split("~"),
    ip = values[0],
    ua = values[1],
    connectionId = values[2];

  return (
    <ListItem key={index}>
      <Typography component="span">
        [{connectionId}] <Divider />
        IP = <RemoteAddressLink value={ip} /> <br />
        UA = {ua ? <RemoteAddressLink value={ua} isUA={true} /> : "Empty user-agent"}
      </Typography>
    </ListItem>
  );
};

export default function VirtualizedList(props) {
  const list = props.list || [],
    { isComplexType } = props;
  return (
    <Box sx={ListSx}>
      <Virtuoso data={list} itemContent={isComplexType ? ComplexRow : SimpleRow} style={{ height: 200 }} />
    </Box>
  );
}
