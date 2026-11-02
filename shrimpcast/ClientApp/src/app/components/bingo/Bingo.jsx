import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, CircularProgress, DialogContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import BingoManager from "../../managers/BingoManager";
import RenderBingoOptions from "./RenderBingoOptions";
import ConfirmDialog from "../others/ConfirmDialog";

const Bingo = (props) => {
  const { displayBingo, setDisplayBingo, configuration, signalR, isAdmin } = props,
    { bingoTitle } = configuration,
    closeBingo = () => {
      setOptions(null);
      setDisplayBingo(false);
    },
    [options, setOptions] = useState(null),
    [resetDialog, setResetDialog] = useState(false),
    openResetDialog = () => setResetDialog(true),
    closeResetDialog = () => setResetDialog(false),
    [resetInProgress, setResetInProgress] = useState(false),
    resetBingo = async () => {
      setResetInProgress(true);
      const response = await BingoManager.ResetBingo(signalR);
      setResetInProgress(false);
      if (response) closeResetDialog();
    };

  useEffect(() => {
    const getOptions = async () => {
      const options = await BingoManager.GetOptions(signalR);
      setOptions(options);
    };

    if (displayBingo) getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayBingo]);

  return (
    <>
      <Dialog open={displayBingo} onClose={closeBingo} maxWidth={"sm"} fullWidth>
        <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
          <Box display="flex" width="100%" marginBottom={"10px"}>
            {bingoTitle}
            {isAdmin && (
              <Button onClick={openResetDialog} sx={{ marginLeft: "auto" }} variant="contained" color="success">
                Reset
              </Button>
            )}
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
      {resetDialog && (
        <ConfirmDialog
          isLoading={resetInProgress}
          title="Reset bingo?"
          confirm={resetBingo}
          cancel={closeResetDialog}
        />
      )}
    </>
  );
};

export default Bingo;
