import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";

const ComboBox = ({ options, label, onChange, value }) => {
  useEffect(() => {
    onChange(null, value);
  }, [options]);

  return (
    <Autocomplete
      disableClearable
      options={options}
      value={value}
      sx={{
        "& .MuiInputBase-root": {
          fontWeight: "bold",
          cursor: "pointer",
          bgcolor: "background.default",
          "&:hover": { bgcolor: "action.hover" },
        },
        "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
          fontWeight: "bold",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            readOnly: true,
            style: {
              pointerEvents: "none",
              cursor: "pointer",
              userSelect: "none",
            },
          }}
        />
      )}
      onChange={onChange}
    />
  );
};

export default ComboBox;
