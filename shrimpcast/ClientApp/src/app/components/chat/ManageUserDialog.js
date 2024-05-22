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
  const [userInfo, setUserInfo] = useState(null),
    sentBy = userInfo?.basicResponse?.previousNames[userInfo?.basicResponse?.previousNames?.length - 1],
    { isAdmin, isMod } = userInfo?.basicResponse || {},
    { siteAdmin, siteMod, sessionId, userSessionId, signalR } = props,
    //targetUserPublic means that the user is authenticated as an admin and the target is not an admin
    targetUserPublic = siteAdmin && !isAdmin,
    showActionsPanel = !isAdmin && (!isMod || siteAdmin) && sessionId !== userSessionId,
    actions = siteAdmin
      ? ChatActionsManager.admin_actions
      : siteMod
      ? ChatActionsManager.mod_actions
      : ChatActionsManager.public_actions,
    actionKeys = Object.keys(actions),
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
          successfulResponse = await ChatActionsManager.ToggleModStatus(signalR, sessionId, !userInfo.isMod);
          break;
        case actions.ignore:
          successfulResponse = ChatActionsManager.Ignore(sessionId, sentBy);
          break;
        case actions.mute:
          successfulResponse = await ChatActionsManager.Mute(signalR, sessionId);
          break;
        case actions.ban:
          successfulResponse = await ChatActionsManager.Ban(signalR, sessionId, false, false);
          break;
        case actions.silentBan:
          successfulResponse = await ChatActionsManager.Ban(signalR, sessionId, true, false);
          break;
        case actions.silentBanAndDelete:
          successfulResponse = await ChatActionsManager.Ban(signalR, sessionId, true, true);
          break;
        case actions.filterBan:
          successfulResponse = await AutoModFiltersManager.Add(signalR, sessionId, props.messageId);
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
      const info = await ChatActionsManager.GetMessageInfo(signalR, props.messageId, sessionId, props.useSession);

      if (!info?.basicResponse) setClosed();
      else setUserInfo(info);
    }

    if (open) getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <IconButton sx={props.OverlayButtonSx} onClick={setOpened}>
        {siteAdmin || siteMod ? (
          <ManageAccountsIcon sx={{ fontSize: "16px" }} />
        ) : (
          <InfoIcon sx={{ fontSize: "16px" }} />
        )}
      </IconButton>
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            {targetUserPublic ? `Manage` : `Details`}
            <Divider />
          </DialogTitle>
          <DialogContent>
            {!userInfo ? (
              <Box width="40px" ml="auto" mr="auto">
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                <Grid container alignItems="center">
                  <Grid xs={12} sm={targetUserPublic ? 10 : 12}>
                    <Typography>
                      User first joined on {new Date(userInfo.basicResponse.createdAt).toLocaleString()}
                      {siteAdmin && ` with ID ${sessionId}`}{" "}
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
                  {targetUserPublic && (
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
                  <Grid xs={12} sm={siteAdmin || showActionsPanel ? 6 : 12}>
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
                    </>
                  )}
                  {showActionsPanel && (
                    <Grid xs={12} sm={6} pb={2}>
                      <Typography>Moderate</Typography>
                      <Divider />
                      <Box height="200px">
                        {actionKeys.map((actionKey) => (
                          <Button
                            onClick={() => openConfirmPrompt(actions[actionKey])}
                            variant="contained"
                            color="error"
                            sx={BanSx(actionKeys.length)}
                            key={actionKey}
                          >
                            {actions[actionKey]}
                          </Button>
                        ))}

                        {showPromptDialog.open && (
                          <ConfirmDialog
                            title={`Confirm ${showPromptDialog.type.toLowerCase()} for ${sentBy}?`}
                            confirm={executeAction}
                            cancel={closeConfirmPrompt}
                          />
                        )}
                      </Box>
                    </Grid>
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
