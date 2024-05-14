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

const BanSx = (optionsCount) => ({
    width: "100%",
    height: `calc(${100 / optionsCount}% - 9px)`,
    marginTop: "9px",
  }),
  MessageIPSx = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

const ManageUserDialog = (props) => {
  //siteAdmin means that the user is authenticated as an admin
  //isAdmin means that the target user is an admin
  const { siteAdmin, isAdmin } = props,
    targetIsUser = siteAdmin && !isAdmin,
    actionKeys = Object.keys(ChatActionsManager.bans),
    [userInfo, setUserInfo] = useState(null),
    [open, setOpen] = useState(false),
    setOpened = () => setOpen(true),
    setClosed = () => setOpen(false),
    [showPromptDialog, setShowPromptDialog] = useState({
      open: false,
      type: "",
    }),
    openConfirmPrompt = (type) => setShowPromptDialog({ open: true, type: type }),
    closeConfirmPrompt = () => setShowPromptDialog({ open: false, type: "" }),
    executeAction = async () => {
      let successfulResponse = false,
        { type } = showPromptDialog,
        actions = ChatActionsManager.actions;

      switch (type) {
        case actions.mod(userInfo.isMod):
          successfulResponse = await ChatActionsManager.ToggleModStatus(
            props.signalR,
            props.sessionId,
            !userInfo.isMod
          );
          break;
        case actions.mute:
          successfulResponse = await ChatActionsManager.Mute(props.signalR, props.sessionId);
          break;
        case actions.ban:
          successfulResponse = await ChatActionsManager.Ban(props.signalR, props.sessionId, false, false);
          break;
        case actions.silentBan:
          successfulResponse = await ChatActionsManager.Ban(props.signalR, props.sessionId, true, false);
          break;
        case actions.silentBanAndDelete:
          successfulResponse = await ChatActionsManager.Ban(props.signalR, props.sessionId, true, true);
          break;
        case actions.filterBan:
          successfulResponse = await AutoModFiltersManager.Add(props.signalR, props.sessionId, props.messageId);
          break;
        default:
          break;
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
            {targetIsUser ? `Manage` : `Details`}
            <Divider />
          </DialogTitle>
          <DialogContent>
            {userInfo === null ? (
              <Box width="40px" ml="auto" mr="auto">
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                <Grid container alignItems="center">
                  <Grid xs={12} sm={targetIsUser ? 10 : 12}>
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
                  </Grid>
                  {targetIsUser && (
                    <Grid xs={12} sm={2} pb="5px">
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: "100%" }}
                        onClick={() => openConfirmPrompt(ChatActionsManager.actions.mod(userInfo.isMod))}
                      >
                        {ChatActionsManager.actions.mod(userInfo.isMod)}
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Divider />
                <Grid container spacing={2} mt="2px">
                  <Grid xs={12} sm={siteAdmin ? 6 : 12}>
                    <Typography>Previous names:</Typography>
                    <VirtualizedList list={userInfo.basicResponse.previousNames} />
                  </Grid>
                  {siteAdmin && (
                    <>
                      <Grid xs={12} sm={6}>
                        <Typography>All token IPs:</Typography>
                        <VirtualizedList list={userInfo.iPs} />
                      </Grid>

                      <Grid xs={12} sm={isAdmin ? 12 : 6}>
                        <Typography sx={MessageIPSx}>Active sessions{userInfo.ip && ` on ${userInfo.ip}`}:</Typography>
                        {userInfo.activeSessions.length === 0 ? (
                          <Typography>IP not connected.</Typography>
                        ) : (
                          <VirtualizedList list={userInfo.activeSessions} />
                        )}
                      </Grid>
                      {!isAdmin && (
                        <Grid xs={12} sm={6} pb={2}>
                          <Typography>Moderate</Typography>
                          <Divider />
                          <Box height="200px">
                            {actionKeys.map((actionKey) => (
                              <Button
                                onClick={() => openConfirmPrompt(ChatActionsManager.bans[actionKey])}
                                variant="contained"
                                color="error"
                                sx={BanSx(actionKeys.length)}
                                key={actionKey}
                              >
                                {ChatActionsManager.bans[actionKey]}
                              </Button>
                            ))}

                            {showPromptDialog.open && (
                              <ConfirmDialog
                                title={`Confirm ${showPromptDialog.type.toLowerCase()} for ${
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
