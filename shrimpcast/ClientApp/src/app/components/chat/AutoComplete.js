import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Box, Paper } from "@mui/material";
import { MenuList, MenuItem, ListItemText } from "@mui/material";
import { useEffect, useRef } from "react";

const AutoCompleteWrapperSx = {
    position: "absolute",
    bottom: "65px",
    width: "100%",
    zIndex: 1,
    backgroundColor: "primary.900",
  },
  AutoCompleteSx = {
    maxHeight: "200px",
    overflowY: "scroll",
    borderRadius: "8px",
  };

const AutoComplete = (props) => {
  const handleClose = () => props.setShowAutocomplete(false),
    { message, nameSuggestions, setMessage, autoCompleteIndex, setAutoCompleteIndex } = props,
    filterNames = () => {
      const substring = message
        .substring(message.lastIndexOf("@") + 1)
        .toLowerCase()
        .trim();
      const options = nameSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(substring));
      return options;
    },
    handleSuggestionClick = (suggestion) => {
      setMessage((message) => {
        handleClose();
        const substring = message.substring(0, message.lastIndexOf("@") + 1);
        return `${substring}${suggestion} `;
      });
      setAutoCompleteIndex(0);
    },
    options = filterNames(),
    scrollReference = useRef();

  useEffect(() => {
    if (options.length > 0 && autoCompleteIndex > options.length - 1) {
      setAutoCompleteIndex(options.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (options.length === 0) {
      setAutoCompleteIndex(0);
      return;
    }

    if (autoCompleteIndex < 0) {
      handleSuggestionClick(options[autoCompleteIndex === Number.MIN_SAFE_INTEGER ? 0 : Math.abs(autoCompleteIndex)]);
    } else if (autoCompleteIndex < options.length) scrollReference.current.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCompleteIndex]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper sx={AutoCompleteWrapperSx} elevation={4}>
        <Box sx={AutoCompleteSx}>
          {options.length ? (
            <MenuList>
              {options.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  dense
                  sx={{ borderRadius: "4px" }}
                  selected={index === autoCompleteIndex}
                  ref={index === autoCompleteIndex ? scrollReference : null}
                >
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: 500,
                      },
                    }}
                  />
                </MenuItem>
              ))}
            </MenuList>
          ) : (
            <ListItemText
              primary="No suggestion found"
              primaryTypographyProps={{
                style: {
                  color: "#888888",
                  padding: "4px 12px",
                },
              }}
            />
          )}
        </Box>
      </Paper>
    </ClickAwayListener>
  );
};

export default AutoComplete;
