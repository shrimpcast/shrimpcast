import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import SignalRManager from "../../managers/SignalRManager";
import BingoOption from "./BingoOption";

const RenderBingoOptions = (props) => {
  const { options, setOptions, signalR } = props,
    addEventHandlers = () => {
      signalR.on(SignalRManager.events.bingoOptionUpdate, (option) =>
        setOptions((existingOptions) => {
          const toUpdate = existingOptions.find((eo) => eo.bingoOptionId === option.bingoOptionId);
          if (toUpdate) toUpdate.isChecked = option.isChecked;
          // Trigger render update
          existingOptions = existingOptions.concat({});
          return existingOptions;
        })
      );

      signalR.on(SignalRManager.events.bingoReset, () =>
        setOptions((existingOptions) => {
          const newOptions = existingOptions.map((existingOption) => ({
            ...existingOption,
            isChecked: false,
          }));
          return newOptions;
        })
      );

      signalR.on(SignalRManager.events.bingoOptionAdded, (option) =>
        setOptions((existingOptions) => existingOptions.concat(option))
      );

      signalR.on(SignalRManager.events.bingoOptionRemoved, (optionId) =>
        setOptions((existingOptions) => existingOptions.filter((eo) => eo.bingoOptionId !== optionId))
      );
    },
    removeEventHandlers = () => {
      signalR.off(SignalRManager.events.bingoOptionUpdate);
      signalR.off(SignalRManager.events.bingoOptionAdded);
      signalR.off(SignalRManager.events.bingoOptionRemoved);
      signalR.off(SignalRManager.events.bingoReset);
    };

  useEffect(() => {
    addEventHandlers();
    return () => removeEventHandlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={1} justifyContent="center">
      {options
        .filter((option) => option.bingoOptionId)
        .map((option) => (
          <BingoOption key={option.bingoOptionId} signalR={signalR} {...option} />
        ))}
    </Grid>
  );
};

export default RenderBingoOptions;
