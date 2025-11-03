import { IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import ConfigUserDialog from "./ConfigUserDialog";
import Bans from "./Bans";
import AutoModFilters from "./AutoModFilters";
import Notifications from "./Notifications";
import AccountInfo from "./AccountInfo";
import EmotesAdmin from "./EmotesAdmin";
import MenuIcon from "@mui/icons-material/Menu";
import Mutes from "./Mutes";
import Moderators from "./Moderators";
import IgnoredUsers from "./IgnoredUsers";
import BingoOptions from "./BingoOptions";
import SiteInfo from "./SiteInfo";
import MediaServer from "./MediaServer/MediaServer";

const Actions = (props) => {
  const theme = useTheme();
  const shouldCollapseMenu = useMediaQuery(theme.breakpoints.down("md"));
  const actions = props.isAdmin
    ? [
        <ConfigUserDialog {...props} />,
        <MediaServer {...props} />,
        <Bans {...props} />,
        <Mutes {...props} />,
        <AutoModFilters {...props} />,
        <Moderators {...props} />,
        <Notifications {...props} />,
        <EmotesAdmin {...props} />,
        <BingoOptions {...props} />,
        <IgnoredUsers {...props} />,
        <SiteInfo {...props} />,
        <AccountInfo {...props} />,
      ]
    : [<SiteInfo {...props} />, <AccountInfo {...props} />, <IgnoredUsers {...props} />];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return shouldCollapseMenu ? (
    <>
      <IconButton
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        color="primary"
        id="menu-button"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "menu-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "primary.700",
            backgroundImage: "none",
            left: "0px !important",
          },
        }}
      >
        {actions.map((action, i) => (
          <MenuItem key={i}>{action}</MenuItem>
        ))}
      </Menu>
    </>
  ) : (
    <>
      {actions.map((action, i) => (
        <React.Fragment key={i}> {action} </React.Fragment>
      ))}
    </>
  );
};

export default Actions;
