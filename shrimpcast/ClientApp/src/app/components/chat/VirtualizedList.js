import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import { isIP } from "is-ip";
import { Link } from "@mui/material";

function renderRow(props) {
  const { index, style, data } = props;
  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      sx={{ wordBreak: "break-all", overflow: "hidden", widht: "100%" }}
      disablePadding
    >
      <ListItemButton>
        <ListItemText>
          {isIP(data[index]) ? (
            <Link href={`https://whatismyipaddress.com/ip/${data[index]}`} target="_blank">
              {data[index]}
            </Link>
          ) : (
            data[index]
          )}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default function VirtualizedList(props) {
  const list = props.list || [];
  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: "5px" }}>
      <FixedSizeList itemData={list} itemCount={list.length} height={200} itemSize={45}>
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
