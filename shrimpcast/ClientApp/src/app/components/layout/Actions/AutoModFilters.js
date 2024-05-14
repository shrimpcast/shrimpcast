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
      {...props}
    />
  );
};

export default AutoModFilters;
