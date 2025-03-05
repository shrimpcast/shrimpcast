import React, { useState } from "react";
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
import ConfirmDialog from "../../../others/ConfirmDialog";
import GenericAddTextItemDialog from "../GenericAddTextItemDialog";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

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

const Sources = ({ fields, sources, setConfig }) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false),
    [sourceToDelete, setSourceToDelete] = useState(null),
    [editOpen, setEditOpen] = useState(false),
    [editContent, setEditContent] = useState({
      title: null,
      description: null,
      value: null,
      sourceId: null,
      field: null,
      allowEmptyEdit: false,
    }),
    [isAddingSource, setIsAddingSource] = useState(false),
    defaultNewSource = {
      isEnabled: false,
      name: "",
      url: "",
      thumbnail: "",
      useLegacyPlayer: false,
      useRTCEmbed: false,
    },
    [newSourceData, setNewSourceData] = useState(defaultNewSource),
    openDeleteConfirmation = (source) => {
      setSourceToDelete(source);
      setDeleteConfirmOpen(true);
    },
    openEditContent = (title, description, value, sourceId, field, allowEmptyEdit) => {
      setEditOpen(true);
      setEditContent({ title, description, value, sourceId, field, allowEmptyEdit });
    },
    closeAdd = () => {
      setIsAddingSource(false);
      setNewSourceData(defaultNewSource);
    },
    updateConfig = (value, target, field, isDelete, isAdd) =>
      setConfig((state) => {
        let { sources } = state.unorderedConfig,
          sourceIndex = sources.findIndex((source) => source.sourceId === target?.sourceId);

        if (isAdd) {
          if (!newSourceData.name.trim() || !newSourceData.url.trim()) return;
          sources = sources.concat({ ...newSourceData, sourceId: Math.floor(Math.random() * 1000000) + 1 });
          closeAdd();
        } else if (isDelete) sources.splice(sourceIndex, 1);
        else sources[sourceIndex][field] = value;

        return {
          ...state,
          unorderedConfig: {
            ...state.unorderedConfig,
            sources,
          },
        };
      }),
    removeItem = (sourceToDelete) => {
      updateConfig(null, sourceToDelete, null, true);
      setDeleteConfirmOpen(false);
    };

  return (
    <Box sx={styles.container}>
      <TableContainer component={Paper} sx={styles.tableContainer}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.sourceId} hover>
                <TableCell>
                  <Switch
                    checked={source.isEnabled}
                    onChange={(e) => updateConfig(e.target.checked, source, "isEnabled")}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{source.name}</Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={source.url}>
                    <Button
                      onClick={() => openEditContent("Source", "URL", source.url, source.sourceId, "url")}
                      variant="outlined"
                      color="info"
                      size="small"
                    >
                      Show
                    </Button>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={styles.thumbnailContainer}>
                    <Box
                      component="img"
                      sx={styles.thumbnail}
                      src={source.thumbnail || DEFAULT_THUMBNAIL}
                      alt={`${source.name} thumbnail`}
                      onError={(e) => {
                        e.target.src = DEFAULT_THUMBNAIL;
                      }}
                    />
                    <Box sx={styles.thumbnailOverlay}>
                      <IconButton
                        onClick={() =>
                          openEditContent("Thumbnail", "URL", source.thumbnail, source.sourceId, "thumbnail", true)
                        }
                        sx={styles.editThumbnailButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch
                    onChange={(e) => updateConfig(e.target.checked, source, "useLegacyPlayer")}
                    checked={source.useLegacyPlayer}
                    color="secondary"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    onChange={(e) => updateConfig(e.target.checked, source, "useRTCEmbed")}
                    checked={source.useRTCEmbed}
                    color="secondary"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete Source">
                    <IconButton color="error" onClick={() => openDeleteConfirmation(source)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {isAddingSource && (
              <TableRow>
                <TableCell>
                  <Switch
                    checked={newSourceData.isEnabled}
                    onChange={(e) => setNewSourceData({ ...newSourceData, isEnabled: e.target.checked })}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newSourceData.name}
                    onChange={(e) => setNewSourceData({ ...newSourceData, name: e.target.value.trim() })}
                    label="Name"
                    variant="outlined"
                    size="small"
                    required
                    autoFocus
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newSourceData.url}
                    onChange={(e) => setNewSourceData({ ...newSourceData, url: e.target.value.trim() })}
                    label="URL"
                    variant="outlined"
                    size="small"
                    required
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newSourceData.thumbnail}
                    onChange={(e) => setNewSourceData({ ...newSourceData, thumbnail: e.target.value.trim() })}
                    label="Thumbnail URL"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={newSourceData.useLegacyPlayer}
                    onChange={(e) => setNewSourceData({ ...newSourceData, useLegacyPlayer: e.target.checked })}
                    color="secondary"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={newSourceData.useRTCEmbed}
                    onChange={(e) => setNewSourceData({ ...newSourceData, useRTCEmbed: e.target.checked })}
                    color="secondary"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => updateConfig(null, null, null, null, true)}
                      disabled={!newSourceData.name.trim() || !newSourceData.url.trim()}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={closeAdd}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="success"
        sx={styles.addButton}
        startIcon={<AddIcon />}
        onClick={() => setIsAddingSource(true)}
      >
        Add source
      </Button>

      {deleteConfirmOpen && (
        <ConfirmDialog
          title={`Are you sure you want to remove ${sourceToDelete.name}?`}
          confirm={() => removeItem(sourceToDelete)}
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
          customCallback={(value) => updateConfig(value, { sourceId: editContent.sourceId }, editContent.field)}
        />
      )}
    </Box>
  );
};

export default Sources;
