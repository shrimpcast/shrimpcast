import React from "react";
import AutoModFiltersManager from "../../../managers/AutoModFiltersManager";
import GenericActionList from "./GenericActionList";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

const AutoModFilters = (props) => {
  const tableModel = {
    fields: [
      {
        name: "content",
        label: "Content",
        type: 2,
        color: "success",
      },
      {
        name: "ignoreCase",
        label: "Ignore case",
        type: 1,
        color: "success",
      },
      {
        name: "ignoreDiacritic",
        label: "Ignore accents",
        type: 1,
        color: "success",
      },
    ],
    requiredFields: ["content"],
    reservedWords: [],
    reservedWordField: "content",
    model: { content: "", ignoreCase: false, ignoreDiacritic: false },
    identifier: "content",
    itemsKey: "filters",
    customActions: {
      add: AutoModFiltersManager.AddWithText,
      edit: AutoModFiltersManager.Edit,
      remove: AutoModFiltersManager.Remove,
    },
  };

  return (
    <GenericActionList
      title="Auto-mod filters"
      getItems={AutoModFiltersManager.GetAll}
      icon={PrecisionManufacturingIcon}
      tableModel={tableModel}
      {...props}
    />
  );
};

export default AutoModFilters;
