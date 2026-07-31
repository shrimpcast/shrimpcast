import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

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
  });

const ActionMenu = (props) => {
  const { actions, forceState } = props,
    [anchorEl, setAnchorEl] = useState(null),
    open = Boolean(anchorEl),
    handleClick = (event) => setAnchorEl(event.currentTarget),
    handleClose = () => setAnchorEl(null),
    reference = useRef(),
    openMenu = () => reference?.current?.click();

  useEffect(() => {
    if (forceState) {
      openMenu();
    } else {
      handleClose();
    }
  }, [forceState]);

  return (
    <>
      <IconButton
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        color="primary"
        id="menu-button"
        ref={reference}
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
        transitionDuration={forceState ? 0 : 250}
      >
        {actions.map((action, i) =>
          action?.mountOwnComponent ? (
            <React.Fragment key={i}>{action.el}</React.Fragment>
          ) : (
            <MenuItem sx={action?.color ? MenuItemSx(action.color) : null} key={i}>
              {action?.el || action}
            </MenuItem>
          ),
        )}
      </Menu>
    </>
  );
};

export default ActionMenu;
