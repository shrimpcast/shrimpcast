import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageUserDialog from "../../chat/ManageUserDialog";
import GenericAddTextItemDialog from "./GenericAddTextItemDialog";
import ConfirmDialog from "../../others/ConfirmDialog";
import GenericAddObjectTable from "./GenericAddObjectTable";

const GenericActionList = (props) => {
  const [open, setOpen] = useState(props.skipButton || false),
    [addDialogOpened, setAddDialogOpened] = useState(false),
    openAddDialog = () => setAddDialogOpened(true),
    [items, setItems] = useState(null),
    setClosed = () => {
      setItems(null);
      setOpen(false);
      props.closeCallback && props.closeCallback();
    },
    setOpened = () => setOpen(true),
    { signalR, responseIsTitleObject, skipConfirmDelete, CustomHeaderComponent } = props,
    [titleAppend, setTitleAppend] = useState(""),
    getItems = async () => {
      const items = await props.getItems(signalR);
      if (responseIsTitleObject) {
        setItems(items[responseIsTitleObject.value]);
        setTitleAppend(` ${responseIsTitleObject.appendTitle.replace("{0}", items[responseIsTitleObject.appendKey])}`);
      } else setItems(items);
    },
    removeItem = async (itemId) => {
      const isRemoved = props.removeItem(signalR, itemId);
      if (!isRemoved) return;
      setItems((items) => items.filter((item) => item[props.identifier] !== itemId));
      !skipConfirmDelete && closeConfirmPrompt();
    },
    Icon = props.icon,
    [showPromptDialog, setShowPromptDialog] = useState({
      open: false,
      id: null,
      content: null,
    }),
    openConfirmPrompt = (id, content) => setShowPromptDialog({ open: true, id, content }),
    closeConfirmPrompt = () => setShowPromptDialog({ open: false, id: null, content: null });

  useEffect(() => {
    if (open) getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {!props.skipButton && (
        <Tooltip title={props.title}>
          <IconButton
            onClick={setOpened}
            type="button"
            size="small"
            sx={{ backgroundColor: "primary.700", borderRadius: "0px" }}
          >
            <Icon sx={{ color: "primary.300" }} />
          </IconButton>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={setClosed}
        maxWidth={props.customWidth ? props.customWidth : "sm"}
        fullWidth={!props.skipFullWidth}
      >
        <DialogTitle sx={{ fontSize: "24px", paddingBottom: "7.5px" }}>
          <Box display="flex" width="100%" marginBottom={"10px"}>
            <Typography variant="h5" fontWeight="bold">
              {props.title}
              <Typography component="span" variant="subtitle1" color="text.secondary">
                {titleAppend}
              </Typography>
            </Typography>
            {props.customButton && (
              <Button onClick={openAddDialog} sx={{ marginLeft: "auto" }} variant="contained" color="success">
                {props.customButton}
              </Button>
            )}
          </Box>
          <Divider />
          {CustomHeaderComponent && CustomHeaderComponent}
        </DialogTitle>
        <DialogContent className={props.showScroll ? "scrollbar-custom" : null}>
          {!items ? (
            <Box width="40px" ml="auto" mr="auto">
              <CircularProgress color="secondary" />
            </Box>
          ) : props.tableModel ? (
            <GenericAddObjectTable {...props.tableModel} items={items} setItems={setItems} signalR={signalR} />
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 1 }}>
              {!items.length ? (
                <Typography ml={1}>No entries found</Typography>
              ) : (
                items.map((item, index) => (
                  <ListItem
                    divider={index !== items.length - 1}
                    key={item[props.identifier]}
                    secondaryAction={
                      <>
                        {item.sessionId && (
                          <ManageUserDialog
                            {...props}
                            siteAdmin={props.isAdmin}
                            siteMod={props.isMod}
                            useSession={true}
                            sessionId={item.sessionId}
                          />
                        )}
                        {props.removeItem && (
                          <IconButton
                            onClick={() =>
                              !skipConfirmDelete
                                ? openConfirmPrompt(item[props.identifier], item[props.contentIdentifier])
                                : removeItem(item[props.identifier])
                            }
                            edge="end"
                            aria-label="delete"
                            sx={{
                              "&:hover": {
                                color: "error.main",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText
                      primary={item[props.contentIdentifier]}
                      sx={[
                        {
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                        },
                        props.removeItem && item.sessionId && { paddingRight: "25px" },
                        responseIsTitleObject?.greenFlag
                          ? { color: item[responseIsTitleObject.greenFlag] ? "success.main" : "warning.main" }
                          : null,
                      ]}
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {addDialogOpened && (
        <GenericAddTextItemDialog setItems={setItems} setAddDialogOpened={setAddDialogOpened} {...props} />
      )}
      {showPromptDialog.open && (
        <ConfirmDialog
          title={`Are you sure you want to ${props.actionName || "remove"} ${showPromptDialog.content}?`}
          confirm={() => removeItem(showPromptDialog.id)}
          cancel={closeConfirmPrompt}
        />
      )}
    </>
  );
};

export default GenericActionList;
