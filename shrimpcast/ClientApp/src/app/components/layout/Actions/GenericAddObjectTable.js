import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../../others/ConfirmDialog";
import GenericAddTextItemDialog from "./GenericAddTextItemDialog";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      gap: 2,
    },
    tableContainer: {
      boxShadow: 3,
      borderRadius: 2,
      flexGrow: 1,
    },
    thumbnail: {
      height: 50,
      borderRadius: 1,
      boxShadow: 1,
      transition: "transform 0.3s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    thumbnailContainer: {
      position: "relative",
      display: "inline-block",
    },
    thumbnailOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      transition: "opacity 0.3s ease-in-out",
      "&:hover": {
        opacity: 1,
      },
    },
    editThumbnailButton: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      },
    },
    addButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
  },
  DEFAULT_THUMBNAIL = "/images/video_thumbnail.png";

const types = {
  boolean: 1,
  text: 2,
  button: 3,
  image: 4,
  date: 5,
  numeric: 6,
};

const dateToISO = (value) => (value ? new Date(value).toISOString() : null);

const Toggle = ({ item, field, updateConfig, itemsKey, identifier, onChange }) => {
    return (
      <Switch
        checked={item[field.name]}
        onChange={onChange || ((e) => updateConfig(e.target.checked, item, field.name, itemsKey, identifier))}
        color={field.color}
      />
    );
  },
  Text = ({ item, field }) => {
    return <Typography variant="body2">{item[field.name]}</Typography>;
  },
  ButtonTooltip = ({ item, field, openEditContent, identifier, itemsKey, requiredFields }) => {
    return (
      <Tooltip title={item[field.name]}>
        <Button
          onClick={() =>
            openEditContent(
              `Set a ${field.label.toLowerCase()}`,
              `Set your ${field.label.toLowerCase()}...`,
              item[field.name],
              item[identifier],
              field.name,
              !requiredFields.includes(field.name),
              identifier,
              itemsKey,
              field.type
            )
          }
          variant="outlined"
          color={field.color}
          size="small"
        >
          Show
        </Button>
      </Tooltip>
    );
  },
  Image = ({ item, field, openEditContent, identifier, itemsKey, requiredFields }) => {
    return (
      <Box sx={styles.thumbnailContainer}>
        <Box
          component="img"
          sx={styles.thumbnail}
          src={item[field.name] || DEFAULT_THUMBNAIL}
          onError={(e) => {
            e.target.src = DEFAULT_THUMBNAIL;
          }}
        />
        <Box sx={styles.thumbnailOverlay}>
          <IconButton
            onClick={() =>
              openEditContent(
                `Set a ${field.label.toLowerCase()}`,
                `Set your ${field.label.toLowerCase()}...`,
                item[field.name],
                item[identifier],
                field.name,
                !requiredFields.includes(field.name),
                identifier,
                itemsKey,
                field.type
              )
            }
            sx={styles.editThumbnailButton}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
    );
  },
  DateField = ({ item, field, updateConfig, utcToLocal, itemsKey, identifier, onChange }) => {
    return (
      <TextField
        onChange={onChange || ((e) => updateConfig(dateToISO(e.target.value), item, field.name, itemsKey, identifier))}
        defaultValue={item[field.name] && utcToLocal(item[field.name])}
        variant="outlined"
        type={"datetime-local"}
        sx={{ width: "200px" }}
      />
    );
  },
  TextAdd = ({ newItemData, field, setNewItemData, requiredFields }) => {
    const isNumeric = field.type === types.numeric;
    return (
      <Box display="table-footer-group">
        <TextField
          value={newItemData[field.name] ?? ""}
          onChange={(e) => {
            const { value } = e.target,
              isEmpty = value === "";
            setNewItemData({
              ...newItemData,
              [field.name]: isEmpty ? null : isNumeric ? +e.target.value : e.target.value.trim(),
              ...(field.probe ? { [field.probeSuccess.key]: false } : {}),
            });
          }}
          label={field.label.toLowerCase()}
          variant="outlined"
          size="small"
          type={isNumeric ? "number" : "text"}
          required={requiredFields.includes(field.name)}
          autoFocus={requiredFields.indexOf(field.name) === 0}
        />
        {field.probe && newItemData[field.name] && (
          <field.probe
            value={newItemData[field.name]}
            onSuccess={() =>
              setNewItemData({
                ...newItemData,
                [field.probeSuccess.key]: field.probeSuccess.value,
              })
            }
          />
        )}
      </Box>
    );
  };

const GenericAddObjectTable = ({
  fields,
  items,
  setItems,
  setConfig,
  utcToLocal,
  requiredFields,
  reservedWords,
  reservedWordField,
  model,
  identifier,
  itemsKey,
  customActions,
  signalR,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false),
    [itemToDelete, setItemToDelete] = useState(null),
    [editOpen, setEditOpen] = useState(false),
    [editContent, setEditContent] = useState({
      title: null,
      description: null,
      value: null,
      itemId: null,
      field: null,
      allowEmptyEdit: false,
      itemsKey: null,
      identifier: null,
      type: null,
    }),
    [isAddingItem, setIsAddingItem] = useState(false),
    [newItemData, setNewItemData] = useState(model),
    openDeleteConfirmation = (item) => {
      setItemToDelete(item);
      setDeleteConfirmOpen(true);
    },
    openEditContent = (title, description, value, itemId, field, allowEmptyEdit, identifier, itemsKey, type) => {
      setEditOpen(true);
      setEditContent({ title, description, value, itemId, field, allowEmptyEdit, identifier, itemsKey, type });
    },
    closeAdd = () => {
      setIsAddingItem(false);
      setNewItemData(model);
    },
    updateConfig = (value, target, field, itemsKey, identifier, isDelete, isAdd) =>
      customActions
        ? (async () => {
            let values = items,
              itemIndex = values.findIndex((item) => item[identifier] === target?.[identifier]);

            if (isAdd) {
              const addedObject = await customActions.add(signalR, newItemData);
              if (!addedObject) return;
              values = values.concat({ ...addedObject });
              closeAdd();
            } else if (isDelete) {
              const removed = await customActions.remove(signalR, values[itemIndex]);
              if (!removed) return;
              values.splice(itemIndex, 1);
            } else {
              values[itemIndex][field] = value;
              const edited = await customActions.edit(signalR, values[itemIndex]);
              if (!edited) return;
            }

            setItems([...values]);
            return;
          })()
        : setConfig((state) => {
            let values = state.unorderedConfig[itemsKey],
              itemIndex = values.findIndex((item) => item[identifier] === target?.[identifier]);

            if (isAdd) {
              values = values.concat({ ...newItemData });
              closeAdd();
            } else if (isDelete) values.splice(itemIndex, 1);
            else values[itemIndex][field] = value;

            return {
              ...state,
              unorderedConfig: {
                ...state.unorderedConfig,
                [itemsKey]: values,
              },
            };
          }),
    removeItem = (itemToDelete) => {
      updateConfig(null, itemToDelete, null, itemsKey, identifier, true);
      setDeleteConfirmOpen(false);
    };

  return (
    <Box sx={styles.container}>
      <TableContainer component={Paper} className="scrollbar-custom" sx={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field.name}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {field.label}
                  </Typography>
                </TableCell>
              ))}
              {/* Extra cell for delete */}
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item[identifier]} hover>
                {fields.map((field) => (
                  <TableCell key={field.name}>
                    {field.type === types.boolean ? (
                      <Toggle
                        item={item}
                        field={field}
                        updateConfig={updateConfig}
                        itemsKey={itemsKey}
                        identifier={identifier}
                      />
                    ) : field.type === types.text ? (
                      <Text item={item} field={field} />
                    ) : field.type === types.button || field.type === types.numeric ? (
                      <ButtonTooltip
                        item={item}
                        field={field}
                        openEditContent={openEditContent}
                        identifier={identifier}
                        itemsKey={itemsKey}
                        requiredFields={requiredFields}
                      />
                    ) : field.type === types.image ? (
                      <Image
                        item={item}
                        field={field}
                        openEditContent={openEditContent}
                        identifier={identifier}
                        itemsKey={itemsKey}
                        requiredFields={requiredFields}
                      />
                    ) : (
                      <DateField
                        item={item}
                        field={field}
                        updateConfig={updateConfig}
                        utcToLocal={utcToLocal}
                        itemsKey={itemsKey}
                        identifier={identifier}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: "right" }}>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmation(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {isAddingItem && (
              <TableRow>
                {fields.map((field) => (
                  <TableCell key={field.name}>
                    {field.type === types.boolean ? (
                      <Toggle
                        item={newItemData}
                        field={field}
                        onChange={(e) => setNewItemData({ ...newItemData, [field.name]: e.target.checked })}
                      />
                    ) : field.type === types.text ||
                      field.type === types.button ||
                      field.type === types.image ||
                      field.type === types.numeric ? (
                      <TextAdd
                        newItemData={newItemData}
                        field={field}
                        setNewItemData={setNewItemData}
                        requiredFields={requiredFields}
                      />
                    ) : (
                      <DateField
                        item={newItemData}
                        field={field}
                        utcToLocal={utcToLocal}
                        onChange={(e) => setNewItemData({ ...newItemData, [field.name]: dateToISO(e.target.value) })}
                      />
                    )}
                  </TableCell>
                ))}

                <TableCell sx={{ textAlign: "right" }}>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => updateConfig(null, null, null, itemsKey, identifier, null, true)}
                      disabled={
                        requiredFields.some((field) => !newItemData[field]) ||
                        reservedWords.includes(newItemData[reservedWordField]) ||
                        items.some((item) => newItemData[reservedWordField] === item[reservedWordField])
                      }
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={closeAdd}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isAddingItem && (
        <Button
          variant="contained"
          color="success"
          sx={styles.addButton}
          startIcon={<AddIcon />}
          onClick={() => setIsAddingItem(true)}
        >
          Add {itemsKey.substring(0, itemsKey.length - 1)}
        </Button>
      )}

      {deleteConfirmOpen && (
        <ConfirmDialog
          title={`Are you sure you want to remove ${itemToDelete[identifier]}?`}
          confirm={() => removeItem(itemToDelete)}
          cancel={() => setDeleteConfirmOpen(false)}
        />
      )}

      {editOpen && (
        <GenericAddTextItemDialog
          gad_title={editContent.title}
          gad_description={editContent.description}
          defaultValue={editContent.value}
          setAddDialogOpened={setEditOpen}
          editMode={true}
          allowEmptyEdit={editContent.allowEmptyEdit}
          isNumeric={editContent.type === types.numeric}
          customCallback={(value) =>
            updateConfig(
              value,
              { [editContent.identifier]: editContent.itemId },
              editContent.field,
              editContent.itemsKey,
              editContent.identifier
            )
          }
        />
      )}
    </Box>
  );
};

export default GenericAddObjectTable;
