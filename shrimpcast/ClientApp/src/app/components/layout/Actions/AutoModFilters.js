import React from "react";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import AutoModFiltersManager from "../../../managers/AutoModFiltersManager";
import GenericActionList from "./GenericActionList";

const AutoModFilters = (props) => {
  return (
    <GenericActionList
      title="Auto-mod filters"
      getItems={AutoModFiltersManager.GetAll}
      removeItem={AutoModFiltersManager.Remove}
      icon={AddModeratorIcon}
      identifier="autoModFilterId"
      contentIdentifier="content"
      {...props}
    />
  );
};

export default AutoModFilters;
