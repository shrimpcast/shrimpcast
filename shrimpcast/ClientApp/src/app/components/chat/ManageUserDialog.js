import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, DialogContent, Divider, IconButton, Link, Typography } from "@mui/material";
import ChatActionsManager from "../../managers/ChatActionsManager";
import VirtualizedList from "./VirtualizedList";
import Grid from "@mui/material/Unstable_Grid2";
import ConfirmDialog from "../others/ConfirmDialog";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InfoIcon from "@mui/icons-material/Info";
import AutoModFiltersManager from "../../managers/AutoModFiltersManager";

const BanSx = {
    width: "100%",
    height: "calc(20% - 9px)",
    marginTop: "9px",
  },
  MessageIPSx = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

const ManageUserDialog = (props) => {
  //siteAdmin means that the user is authenticated as an admin
  //isAdmin means that the target user is an admin
  const { siteAdmin, isAdmin } = props,
    [userInfo, setUserInfo] = useState(null),
    [open, setOpen] = useState(false),
    setOpened = () => setOpen(true),
    setClosed = () => setOpen(false),
    [showPromptDialog, setShowPromptDialog] = useState({
      open: false,
      type: "",
    }),
    openConfirmPrompt = (type) => setShowPromptDialog({ open: true, type }),
    closeConfirmPrompt = () => setShowPromptDialog({ open: false, type: "" }),
    executeAction = async () => {
      let successfulResponse = false,
        type = showPromptDialog.type;

      if (type === "mute") {
        successfulResponse = await ChatActionsManager.Mute(props.signalR, props.sessionId);
      } else if (type.includes("filter")) {
        successfulResponse = await AutoModFiltersManager.Add(props.signalR, props.sessionId, props.messageId);
      } else {
        successfulResponse = await ChatActionsManager.Ban(
          props.signalR,
          props.sessionId,
          type !== "ban",
          type.includes("delete")
        );
      }
      if (!successfulResponse) return;
      closeConfirmPrompt();
      setClosed();
    };

  useEffect(() => {
    async function getInfo() {
      const info = await ChatActionsManager.GetMessageInfo(
        props.signalR,
        props.messageId,
        props.sessionId,
        props.useSession
      );

      if (!info?.basicResponse) setClosed();
      else setUserInfo(info);
    }

    if (open) getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <IconButton sx={props.OverlayButtonSx} onClick={setOpened}>
        {props.siteAdmin ? <ManageAccountsIcon sx={{ fontSize: "16px" }} /> : <InfoIcon sx={{ fontSize: "16px" }} />}
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            {siteAdmin && !isAdmin ? `Manage` : `Details`}
            <Divider />
          </DialogTitle>
          <DialogContent>
            {userInfo === null ? (
              <Box width="40px" ml="auto" mr="auto">
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                <Typography>
                  User first joined on {new Date(userInfo.basicResponse.createdAt).toLocaleString()}
                  {siteAdmin && ` with ID ${props.sessionId}`}{" "}
                </Typography>
                {props.createdAt && (
                  <Typography>Message sent at {new Date(props.createdAt).toLocaleString()}</Typography>
                )}
                {userInfo.mutedUntil && (
                  <Typography>Muted until {new Date(userInfo.mutedUntil).toLocaleString()}</Typography>
                )}
                {siteAdmin && userInfo.ip && (
                  <Typography>
                    Message was sent from{" "}
                    <Link
                      sx={{ wordWrap: "break-word" }}
                      href={`https://whatismyipaddress.com/ip/${userInfo.ip}`}
                      target="_blank"
                    >
                      {userInfo.ip}
                    </Link>
                  </Typography>
                )}
                <Divider />
                <Grid container spacing={2} mt="2px">
                  <Grid xs={12} lg={siteAdmin ? 6 : 12}>
                    <Typography>Previous names:</Typography>
                    <VirtualizedList list={userInfo.basicResponse.previousNames} />
                  </Grid>
                  {siteAdmin && (
                    <>
                      <Grid xs={12} lg={6}>
                        <Typography>All token IPs:</Typography>
                        <VirtualizedList list={userInfo.iPs} />
                      </Grid>

                      <Grid xs={12} lg={isAdmin ? 12 : 6}>
                        <Typography sx={MessageIPSx}>Active sessions{userInfo.ip && ` on ${userInfo.ip}`}:</Typography>
                        {userInfo.activeSessions.length === 0 ? (
                          <Typography>IP not connected.</Typography>
                        ) : (
                          <VirtualizedList list={userInfo.activeSessions} />
                        )}
                      </Grid>
                      {!isAdmin && (
                        <Grid xs={12} lg={6} pb={2}>
                          <Typography>Moderate </Typography>
                          <Divider />
                          <Box height="200px">
                            <Button
                              onClick={() => openConfirmPrompt("mute")}
                              variant="contained"
                              color="error"
                              sx={BanSx}
                            >
                              Mute
                            </Button>
                            <Button
                              onClick={() => openConfirmPrompt("ban")}
                              variant="contained"
                              color="error"
                              sx={BanSx}
                            >
                              Ban
                            </Button>
                            <Button
                              onClick={() => openConfirmPrompt("silent ban")}
                              variant="contained"
                              color="error"
                              sx={BanSx}
                            >
                              Silent ban
                            </Button>
                            <Button
                              onClick={() => openConfirmPrompt("silent ban and delete")}
                              variant="contained"
                              color="error"
                              sx={BanSx}
                            >
                              Silent ban and delete
                            </Button>
                            <Button
                              onClick={() => openConfirmPrompt("filter and ban")}
                              variant="contained"
                              color="error"
                              sx={BanSx}
                            >
                              Filter and ban
                            </Button>
                            {showPromptDialog.open && (
                              <ConfirmDialog
                                title={`Confirm ${showPromptDialog.type} for ${
                                  userInfo.basicResponse.previousNames[userInfo.basicResponse.previousNames.length - 1]
                                }?`}
                                confirm={executeAction}
                                cancel={closeConfirmPrompt}
                              />
                            )}
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ManageUserDialog;
