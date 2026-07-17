import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import ChatActionsManager from "../../managers/ChatActionsManager";
import VirtualizedList from "./VirtualizedList";
import Grid from "@mui/material/Unstable_Grid2";
import ConfirmDialog from "../others/ConfirmDialog";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InfoIcon from "@mui/icons-material/Info";
import AutoModFiltersManager from "../../managers/AutoModFiltersManager";
import { useTheme } from "@emotion/react";

const BanSx = (optionsCount, i) => ({
    width: "100%",
    minHeight: "40px",
    height: `calc(${100 / optionsCount}%${i === optionsCount - 1 ? "" : " - 7.5px"})`,
    marginBottom: i === optionsCount - 1 ? "0px" : "7.5px",
    borderRadius: "5px",
  }),
  MessageIPSx = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ManageUserButtonSx = (theme, isRightButton) => ({
    width: "49%",
    ml: isRightButton ? "10px" : "0px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      ml: "0px",
      mt: isRightButton ? "7.5px" : "0px",
    },
  });

const ManageUserDialog = (props) => {
  //siteAdmin means that the user is authenticated as an admin
  //isAdmin means that the target user is an admin
  const [userInfo, setUserInfo] = useState(null),
    sentBy = userInfo?.basicResponse?.previousNames[userInfo?.basicResponse?.previousNames?.length - 1],
    { isAdmin, isMod } = userInfo?.basicResponse || {},
    //component manages its own open/close state, but it can be overriden by using externalOpenUserDialog & closeExternalUserDialog
    {
      siteAdmin,
      siteMod,
      sessionId,
      userSessionId,
      signalR,
      externalOpenUserDialog,
      closeExternalUserDialog,
      skipUserDialogButton,
    } = props,
    //targetUserPublic means that the user is authenticated as an admin and the target is not an admin
    targetUserPublic = siteAdmin && !isAdmin,
    showActionsPanel = !isAdmin && (!isMod || siteAdmin) && sessionId !== userSessionId,
    actions = siteAdmin
      ? ChatActionsManager.admin_actions
      : siteMod
        ? ChatActionsManager.mod_actions
        : ChatActionsManager.public_actions,
    actionKeys = Object.keys(actions),
    theme = useTheme(),
    [open, setOpen] = useState(false),
    setOpened = () => setOpen(true),
    setClosed = () => {
      setOpen(false);
      closeExternalUserDialog && closeExternalUserDialog();
    },
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
        case actions.verify(userInfo.isVerified):
          successfulResponse = await ChatActionsManager.ToggleVerifiedStatus(signalR, sessionId, !userInfo.isVerified);
          break;
        case actions.ignore:
          successfulResponse = ChatActionsManager.Ignore(sessionId, sentBy);
          break;
        case actions.t_mute:
          successfulResponse = await ChatActionsManager.Mute(signalR, sessionId, false);
          break;
        case actions.p_mute:
          successfulResponse = await ChatActionsManager.Mute(signalR, sessionId, true);
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

  useEffect(() => {
    if (externalOpenUserDialog) setOpened();
  }, [externalOpenUserDialog]);

  return (
    <>
      {!skipUserDialogButton && (
        <Tooltip title="User profile">
          <IconButton sx={props.OverlayButtonSx} onClick={setOpened}>
            {siteAdmin || siteMod ? (
              <ManageAccountsIcon sx={{ fontSize: "16px" }} />
            ) : (
              <InfoIcon sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <Dialog open={open} onClose={setClosed} maxWidth={"sm"} fullWidth>
          <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
            User profile
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
                  {/* ------------- Basic user info ------------- */}

                  <Grid xs={12}>
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
                        </Link>{" "}
                        with ID {props.messageId}
                      </Typography>
                    )}
                    {siteAdmin && userInfo.ua && (
                      <Typography>
                        User-Agent:{" "}
                        <Link
                          sx={{ wordWrap: "break-word" }}
                          href={`https://gs.statcounter.com/detect?useragent=${encodeURIComponent(userInfo.ua)}`}
                          target="_blank"
                        >
                          {userInfo.ua}
                        </Link>
                      </Typography>
                    )}
                  </Grid>

                  {/* ------------- Management buttons ------------- */}

                  {targetUserPublic && (
                    <Grid xs={12} mt="5px" mb="5px">
                      <Divider sx={{ marginBottom: "5px" }} />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={ManageUserButtonSx(theme)}
                        onClick={() => openConfirmPrompt(ChatActionsManager.actions.verify(userInfo.isVerified))}
                      >
                        <Typography variant="overline">
                          {ChatActionsManager.actions.verify(userInfo.isVerified)}
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={ManageUserButtonSx(theme, true)}
                        onClick={() => openConfirmPrompt(ChatActionsManager.actions.mod(userInfo.isMod))}
                      >
                        <Typography variant="overline">{ChatActionsManager.actions.mod(userInfo.isMod)}</Typography>
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Divider />

                {/* ------------- Information panels ------------- */}

                <Grid container spacing={2} mt="2px">
                  {/* ------------- Previous names ------------- */}

                  <Grid xs={12} sm={siteAdmin || showActionsPanel ? 6 : 12}>
                    <Typography variant="overline" lineHeight="initial">
                      Previous names ({userInfo.basicResponse.previousNames.length}):
                    </Typography>
                    <VirtualizedList
                      list={userInfo.basicResponse.previousNames}
                      dynamicHeight={!siteAdmin && !showActionsPanel}
                    />
                  </Grid>

                  {siteAdmin && (
                    <>
                      {/* ------------- Remote addresses (IPs) ------------- */}

                      <Grid xs={12} sm={6}>
                        <Typography variant="overline" lineHeight="initial">
                          All session addresses ({userInfo.iPs.length}):
                        </Typography>
                        <VirtualizedList list={userInfo.iPs} />
                      </Grid>

                      {/* ------------- Active connections ------------- */}

                      <Grid xs={12} sm={isAdmin ? 12 : 6}>
                        <Typography variant="overline" lineHeight="initial" sx={MessageIPSx}>
                          Active sessions
                          {userInfo.ip ? (
                            <>
                              {" "}
                              on{" "}
                              <Link
                                sx={{ wordWrap: "break-word" }}
                                href={`https://whatismyipaddress.com/ip/${userInfo.ip}`}
                                target="_blank"
                              >
                                {userInfo.ip}
                              </Link>
                            </>
                          ) : (
                            " for session token"
                          )}
                          :
                        </Typography>
                        {!userInfo.activeSessions?.length ? (
                          <Typography variant="overline" lineHeight="initial">
                            <br />
                            {props.useSession ? "Session not connected" : "Remote address not connected"}
                          </Typography>
                        ) : (
                          <VirtualizedList
                            isComplexType={props.useSession}
                            list={userInfo.activeSessions}
                            dynamicHeight={!showActionsPanel && !props.useSession}
                          />
                        )}
                      </Grid>
                    </>
                  )}

                  {/* ------------- Moderation buttons ------------- */}

                  {showActionsPanel && (
                    <Grid xs={12} sm={6} pb={2}>
                      <Typography variant="overline" lineHeight="initial">
                        Moderate
                      </Typography>
                      <Divider sx={{ marginTop: "2.5px", marginBottom: "5px" }} />
                      <Box height={"200px"} overflow={"auto"}>
                        {actionKeys.map((actionKey, index) => (
                          <Button
                            onClick={() => openConfirmPrompt(actions[actionKey])}
                            variant="contained"
                            color="error"
                            sx={BanSx(actionKeys.length, index)}
                            key={actionKey}
                          >
                            <Typography variant="overline" lineHeight="initial">
                              {actions[actionKey]}
                            </Typography>
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
