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
import GithubPrompt from "../Prompts/GithubPrompt";
import NotificationPrompt from "../Prompts/NotificationPrompt";
import { blue, indigo } from "@mui/material/colors";

const MenuSx = {
    "& .MuiPaper-root": {
      backgroundColor: "primary.700",
      backgroundImage: "none",
      left: "0px !important",
      paddingBottom: "0px",
    },
  },
  MenuItemSx = (color) => ({
    backgroundColor: color[700],
    "&:hover": {
      backgroundColor: color[600],
    },
  }),
  BorderRightRadius = {
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  };

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
        <AccountInfo {...props} customStyles={BorderRightRadius} />,
      ]
    : [
        <SiteInfo {...props} />,
        <AccountInfo {...props} />,
        { el: <GithubPrompt />, color: indigo },
        { el: <NotificationPrompt {...props} />, color: blue },
        <IgnoredUsers {...props} customStyles={BorderRightRadius} />,
      ];

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
          sx: { pb: 0 },
        }}
        sx={MenuSx}
      >
        {actions.map((action, i) => (
          <MenuItem sx={action?.color ? MenuItemSx(action.color) : null} key={i}>
            {action?.el || action}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) : (
    <>
      {actions.map((action, i) => (
        <React.Fragment key={i}> {action?.el || action}</React.Fragment>
      ))}
    </>
  );
};

export default Actions;
