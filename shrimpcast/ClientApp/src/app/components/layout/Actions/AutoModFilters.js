import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { Box, DialogContent, Divider, IconButton, List, ListItem, ListItemText } from "@mui/material";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoModFiltersManager from "../../../managers/AutoModFiltersManager";

const AutoModFilters = (props) => {
  const [open, setOpen] = useState(false),
    [autoModFilters, setAutoModFilters] = useState([]),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    getAutoModFilters = async () => {
      const autoModFilters = await AutoModFiltersManager.GetAll(props.signalR);
      setAutoModFilters(autoModFilters);
    },
    removeAutoModFilter = async (autoModFilterId) => {
      const isRemoved = AutoModFiltersManager.Remove(props.signalR, autoModFilterId);
      if (!isRemoved) return;
      setAutoModFilters((autoModFilters) =>
        autoModFilters.filter((autoModFilter) => autoModFilter.autoModFilterId !== autoModFilterId)
      );
    };

  useEffect(() => {
    if (open) getAutoModFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
        <AddModeratorIcon sx={{ color: "primary.500" }} />
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            <Box display="flex" width="100%" marginBottom={"10px"}>
              Auto-mod filters
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {autoModFilters.map((autoModFilter) => (
                <ListItem
                  key={autoModFilter.autoModFilterId}
                  secondaryAction={
                    <IconButton
                      onClick={() => removeAutoModFilter(autoModFilter.autoModFilterId)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText sx={{ wordWrap: "break-word" }} primary={autoModFilter.content} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AutoModFilters;
