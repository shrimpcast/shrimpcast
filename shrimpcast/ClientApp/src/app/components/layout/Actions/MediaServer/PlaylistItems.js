import { Box, Button, Checkbox, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MediaServerManager from "../../../../managers/MediaServerManager";
import MovieIcon from "@mui/icons-material/Movie";
import GenericActionList from "../GenericActionList";

const ShowItemsButtonSx = {
    display: "block",
    width: "100%",
    height: "38px",
    fontWeight: "bold",
    borderRadius: "0 0 8px 8px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    boxShadow: "none",
  },
  ShowItemsButtonTextSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontWeight: "bold",
  },
  FilterTypeSx = (isChecked) => ({
    position: "absolute",
    top: "1px",
    right: "1px",
    backgroundColor: isChecked ? "secondary.400" : "error.main",
    height: "13.5px",
    borderRadius: "1px",
    borderTopRightRadius: "5px",
    zIndex: 50,
    cursor: "pointer",
  }),
  CheckBoxSx = {
    color: "white",
    "& .MuiSvgIcon-root": { fontSize: 19 },
    p: 0,
    m: 0,
    position: "relative",
    "&.Mui-checked": {
      color: "primary.800",
    },
    left: "3px",
    bottom: "8.5px",
    zIndex: 5,
  },
  LabelSx = (isChecked) => ({
    fontSize: 11.5,
    position: "relative",
    bottom: "8px",
    fontWeight: "bold",
    color: isChecked ? "primary.900" : "white",
    left: "3px",
  });

const PlaylistItems = ({ value, onSuccess }) => {
  const [open, setOpen] = useState(false),
    handleOpen = () => setOpen(true),
    handleClose = () => setOpen(false),
    [showNamesOnly, setShowNamesOnly] = useState(false),
    toggleShowNames = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNamesOnly((value) => !value);
    };

  useEffect(
    () => onSuccess({}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  return (
    <>
      <Button onClick={handleOpen} variant="contained" color="success" sx={ShowItemsButtonSx}>
        <Box sx={ShowItemsButtonTextSx}>
          <Typography variant="overline">SHOW PARSED ITEMS</Typography>
        </Box>
        <Box onClick={toggleShowNames} sx={FilterTypeSx(showNamesOnly)}>
          <Typography className="noselect" variant="overline" sx={LabelSx(showNamesOnly)}>
            ?filename
          </Typography>
          <Checkbox checked={showNamesOnly} sx={CheckBoxSx} />
        </Box>
      </Button>

      {open && (
        <GenericActionList
          title={`Playlist items`}
          getItems={() => MediaServerManager.SanitizePlaylisteItems(value, showNamesOnly)}
          icon={MovieIcon}
          identifier="itemId"
          contentIdentifier="itemValue"
          showScroll={true}
          skipButton={true}
          closeCallback={handleClose}
          responseIsTitleObject={{
            appendTitle: "{0} playlist item(s)",
            appendKey: "totalItems",
            value: "items",
          }}
        />
      )}
    </>
  );
};

export default PlaylistItems;
