import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import TabPanel from "../TabPanel";
import ColourPicker from "../../others/ColourPicker";
import SourceList from "./Sources/Sources";

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const ConfigUserDialog = (props) => {
  const [open, setOpen] = useState(false),
    [isSaving, setSaving] = useState(false),
    setClosed = () => {
      setOpen(false);
      setConfig(null);
    },
    setOpened = () => setOpen(true),
    [config, setConfig] = useState(null),
    [tabValue, setTabValue] = useState(0),
    tabChange = (_event, newValue) => setTabValue(newValue),
    lowercaseKeys = (obj) => {
      let key,
        keys = Object.keys(obj);
      let n = keys.length;
      let newObj = {};
      while (n--) {
        key = keys[n];
        newObj[key.toLowerCase()] = obj[key];
      }
      return newObj;
    },
    fetchParsedConfig = async () => {
      const response = await AdminActionsManager.GetOrderedConfig(props.signalR);
      if (!response) {
        setClosed();
        return;
      }
      response.unorderedConfig = lowercaseKeys(response.unorderedConfig);
      setConfig(response);
    },
    updateConfig = (value, target) =>
      setConfig((state) => ({
        ...state,
        unorderedConfig: {
          ...state.unorderedConfig,
          [target.name]: value,
        },
      })),
    saveConfig = async () => {
      setSaving(true);
      const configSaved = await AdminActionsManager.SaveConfig(props.signalR, config.unorderedConfig, config.openKey);
      setSaving(false);
      if (configSaved) setClosed();
      else setTimeout(() => alert("Could not update configuration"), 200);
    },
    utcToLocal = (time) => {
      const date = new Date(time);
      const padStart = (num, length) => num.toString().padStart(length || 2, "0");
      const year = padStart(date.getFullYear(), 4);
      const month = padStart(date.getMonth() + 1);
      const day = padStart(date.getDate());
      const hours = padStart(date.getHours());
      const minutes = padStart(date.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    themeColors = (() => {
      const colors = require("@mui/material/colors");
      const parsedColors = Object.keys(colors)
        .filter((color) => colors[color][500])
        .map((color, i) => ({
          nameColourId: i,
          name: color,
          colourHex: colors[color][500],
        }));
      return parsedColors;
    })();

  useEffect(() => {
    if (open) fetchParsedConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Tooltip title="Configuration">
        <IconButton
          onClick={setOpened}
          type="button"
          size="small"
          sx={{ backgroundColor: "primary.700", borderRadius: "0px" }}
        >
          <SettingsIcon sx={{ color: "primary.300" }} />
        </IconButton>
      </Tooltip>
      {config && (
        <Dialog open={open} onClose={setClosed} maxWidth={"xl"}>
          <DialogTitle sx={{ fontSize: "24px", pb: "7.5px" }}>
            <Box display="flex" width="100%" mb={"10px"}>
              Configuration
              <Button
                onClick={saveConfig}
                sx={{ marginLeft: "auto" }}
                variant="contained"
                color="success"
                disabled={isSaving}
              >
                Save
              </Button>
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabValue} onChange={tabChange} variant="scrollable" scrollButtons={false}>
                {config.orderedConfig.map((configSection, index) => (
                  <Tab key={configSection.name} label={configSection.name} {...a11yProps(index)} />
                ))}
              </Tabs>
            </Box>

            {config.orderedConfig.map((configSection, index) => (
              <TabPanel value={tabValue} index={index} key={configSection.name}>
                {configSection.values.map((configItem) =>
                  typeof configItem.value === "boolean" ? (
                    <FormControlLabel
                      key={configItem.name}
                      onChange={(e) => updateConfig(e.target.checked, configItem)}
                      sx={{ ml: "-10px", mb: "10px", width: "100%" }}
                      control={<Checkbox checked={config.unorderedConfig[configItem.name]} />}
                      label={configItem.label}
                    />
                  ) : typeof configItem.value === "number" ? (
                    <TextField
                      key={configItem.name}
                      onChange={(e) => updateConfig(+e.target.value, configItem)}
                      label={configItem.label}
                      defaultValue={config.unorderedConfig[configItem.name]}
                      variant="outlined"
                      type="number"
                      sx={{ mb: "10px", display: "block" }}
                    />
                  ) : configItem.name === config.sourceKey ? (
                    <SourceList
                      key={configItem.name}
                      fields={configItem.fields}
                      sources={config.unorderedConfig[configItem.name]}
                      setConfig={setConfig}
                      utcToLocal={utcToLocal}
                    />
                  ) : !config.colorPickerKeys.includes(configItem.name) ? (
                    <TextField
                      key={configItem.name}
                      onChange={(e) => updateConfig(e.target.value, configItem)}
                      label={configItem.label}
                      defaultValue={
                        configItem.name !== config.openKey
                          ? config.unorderedConfig[configItem.name]
                          : utcToLocal(config.unorderedConfig[configItem.name])
                      }
                      variant="outlined"
                      type={configItem.name !== config.openKey ? "text" : "datetime-local"}
                      sx={{ width: configItem.name !== config.openKey ? "100%" : "auto", marginBottom: "10px" }}
                    />
                  ) : (
                    <Box sx={{ mb: "10px" }} key={configItem.name}>
                      <ColourPicker
                        userDisplayColor={
                          themeColors.find((tc) => tc.name === config.unorderedConfig[configItem.name])?.colourHex
                        }
                        colours={themeColors}
                        executeCallback={(nameColourId) => {
                          updateConfig(themeColors[nameColourId]?.name, configItem);
                          return themeColors[nameColourId]?.colourHex;
                        }}
                        text={`${configItem.label} (${config.unorderedConfig[configItem.name]})`}
                        width="100%"
                        useBorderRadius
                      />
                    </Box>
                  )
                )}
              </TabPanel>
            ))}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ConfigUserDialog;
