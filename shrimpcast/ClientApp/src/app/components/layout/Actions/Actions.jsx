import { useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfigUserDialog from "./ConfigUserDialog";
import Bans from "./Bans";
import AutoModFilters from "./AutoModFilters";
import Notifications from "./Notifications";
import AccountInfo from "./AccountInfo";
import EmotesAdmin from "./EmotesAdmin";
import Mutes from "./Mutes";
import Moderators from "./Moderators";
import IgnoredUsers from "./IgnoredUsers";
import BingoOptions from "./BingoOptions";
import SiteInfo from "./SiteInfo";
import MediaServer from "./MediaServer/MediaServer";
import GithubPrompt from "../Prompts/GithubPrompt";
import NotificationPrompt from "../Prompts/NotificationPrompt";
import { indigo } from "@mui/material/colors";
import ActionMenu from "./ActionMenu";

const MenuItemSx = (color) => ({
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
        { el: <NotificationPrompt {...props} sx={MenuItemSx} />, mountOwnComponent: true },
        <IgnoredUsers {...props} customStyles={BorderRightRadius} />,
      ];
  const [forceToggle, setForceToggle] = useState(false);
  const toggleMenu = () => setForceToggle((forceToggle) => !forceToggle);

  useEffect(() => {
    document.addEventListener("toggleMenu", toggleMenu);
    return () => document.removeEventListener("toggleMenu", toggleMenu);
  }, []);

  return shouldCollapseMenu ? (
    <ActionMenu actions={actions} forceState={forceToggle} {...props} />
  ) : (
    <>
      {actions.map((action, i) => (
        <React.Fragment key={i}> {action?.el || action}</React.Fragment>
      ))}
    </>
  );
};

export default Actions;
