import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, CircularProgress, DialogContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import BingoManager from "../../managers/BingoManager";
import RenderBingoOptions from "./RenderBingoOptions";

const Bingo = (props) => {
  const { displayBingo, setDisplayBingo, configuration, signalR } = props,
    { bingoTitle } = configuration,
    closeBingo = () => {
      setOptions(null);
      setDisplayBingo(false);
    },
    [options, setOptions] = useState(null);

  useEffect(() => {
    const getOptions = async () => {
      const options = await BingoManager.GetOptions(signalR);
      setOptions(options);
    };

    if (displayBingo) getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayBingo]);

  return (
    <Dialog open={displayBingo} onClose={closeBingo} maxWidth={"sm"} fullWidth>
      <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
        <Box display="flex" width="100%" marginBottom={"10px"}>
          {bingoTitle}
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent>
        {!options ? (
          <Box width="40px" ml="auto" mr="auto">
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <RenderBingoOptions options={options} setOptions={setOptions} {...props} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Bingo;
