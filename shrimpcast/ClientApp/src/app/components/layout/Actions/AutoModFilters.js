import React from "react";
import AutoModFiltersManager from "../../../managers/AutoModFiltersManager";
import GenericActionList from "./GenericActionList";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

const AutoModFilters = (props) => {
  return (
    <GenericActionList
      title="Auto-mod filters"
      getItems={AutoModFiltersManager.GetAll}
      removeItem={AutoModFiltersManager.Remove}
      icon={PrecisionManufacturingIcon}
      identifier="autoModFilterId"
      contentIdentifier="content"
      customButton="Add filter"
      gad_description="Filter content"
      gad_title="Add auto-mod filter"
      gad_handleSubmit={AutoModFiltersManager.AddWithText}
      {...props}
    />
  );
};

export default AutoModFilters;
