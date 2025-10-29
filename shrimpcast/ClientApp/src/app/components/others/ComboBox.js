import { Autocomplete, TextField, Typography } from "@mui/material";
import { useEffect } from "react";

const ComboBox = ({ options, label, onChange, value }) => {
  useEffect(() => {
    onChange(null, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Typography key={key} {...optionProps} variant="overline" sx={{ fontWeight: "bold" }}>
            {typeof option === "string" ? option : option.label}
          </Typography>
        );
      }}
      onChange={onChange}
    />
  );
};

export default ComboBox;
