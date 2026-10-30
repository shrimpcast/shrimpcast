import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Typography,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import ProbeObject from "./ProbeObject";
import ComboBox from "../../../others/ComboBox";

const ProbeButtonSx = {
  display: "block",
  width: "100%",
  height: "38px",
  fontWeight: "bold",
  borderRadius: "0 0 8px 8px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  boxShadow: "none",
};

const ProbeButtonTextSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontWeight: "bold",
};

const configs = {
  videoEncodingOptions: ["PASSTHROUGH", "H264"],
  audioEncodingOptions: ["PASSTHROUGH", "AAC"],
  transcodingPresets: ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"],
};

const Probe = ({ onSuccess, value }) => {
  const [open, setOpen] = useState(false),
    [streams, setStreams] = useState({}),
    videoDefaults = {
      videoStreamIndex: null,
      videoEncodingPreset: configs.videoEncodingOptions[0],
      videoTranscodingBitrate: 3072,
      videoTranscodingFramerate: 60,
      videoTranscodingPreset: configs.transcodingPresets[0],
    },
    audioDefaults = {
      audioStreamIndex: null,
      audioEncodingPreset: configs.audioEncodingOptions[0],
      audioAACBitrate: 64,
      audioTranscodingVolume: -1,
      audioTranscodingLoudnessNormalization: false,
      audioCustomSource: "",
    },
    [config, setConfig] = useState({ ...videoDefaults, ...audioDefaults }),
    updateConfig = (key, value) => setConfig((config) => ({ ...config, [key]: value }));

  const handleOpen = () => setOpen(true),
    handleClose = () => {
      setOpen(false);
      setStreams([]);
      setConfig({ ...videoDefaults, ...audioDefaults });
      setProbeAudioSource(false);
    },
    [probeAudioSource, setProbeAudioSource] = useState(),
    validUrl = (url) => {
      try {
        return new URL(url);
      } catch (e) {}
    };

  return (
    <>
      <Button disabled={open} onClick={handleOpen} variant="contained" color="success" sx={ProbeButtonSx}>
        <Box sx={ProbeButtonTextSx}>
          <Typography variant="overline">PROBE</Typography>
          {open && <CircularProgress size={12} thickness={5} sx={{ mb: "5px" }} />}
        </Box>
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          {!streams.videoStreams?.length ? (
            <ProbeObject title="Probe source" type="all" url={value} setStreams={setStreams} />
          ) : (
            <>
              <Stack
                spacing={2}
                sx={{
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  mx: "auto",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Stream configuration - video
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Stack spacing={1}>
                  <ComboBox
                    options={streams.videoStreamsMapped}
                    onChange={(e, value) => {
                      setConfig((config) => ({ ...config, ...videoDefaults, videoStreamIndex: value.index }));
                    }}
                    label="Source"
                    value={
                      config.videoStreamIndex === null
                        ? streams.videoStreamsMapped[0]
                        : streams.videoStreamsMapped.find((s) => s.index === config.videoStreamIndex)
                    }
                  />
                </Stack>
                <Stack spacing={1}>
                  <ComboBox
                    options={configs.videoEncodingOptions}
                    label="Codec"
                    onChange={(e, value) => updateConfig("videoEncodingPreset", value)}
                    value={config.videoEncodingPreset}
                  />
                </Stack>
                {config.videoEncodingPreset !== configs.videoEncodingOptions[0] && (
                  <>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        onChange={(e) => updateConfig("videoTranscodingBitrate", +e.target.value)}
                        label="Bitrate (kbps)"
                        value={config.videoTranscodingBitrate}
                        type="number"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        label="Framerate (fps)"
                        onChange={(e, value) => updateConfig("videoTranscodingFramerate", +e.target.value)}
                        value={config.videoTranscodingFramerate}
                        type="number"
                        variant="outlined"
                        fullWidth
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <ComboBox
                        options={configs.transcodingPresets}
                        label="Preset"
                        onChange={(e, value) => updateConfig("videoTranscodingPreset", value)}
                        value={config.videoTranscodingPreset}
                      />
                    </Stack>
                  </>
                )}
              </Stack>
              <Stack
                spacing={2}
                sx={{
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  mx: "auto",
                  mt: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Stream configuration - audio
                  {streams.audioStreamsMapped?.length ? (
                    <Button
                      onClick={() => {
                        const isProbing = probeAudioSource || Boolean(config.audioCustomSource);
                        if (!isProbing) {
                          setStreams((streams) => ({
                            ...streams,
                            ogAudioStreams: streams.audioStreams,
                            ogAudioStreamsMapped: streams.audioStreamsMapped,
                          }));
                        } else {
                          setStreams((streams) => ({
                            ...streams,
                            audioStreams: streams.ogAudioStreams,
                            audioStreamsMapped: streams.ogAudioStreamsMapped,
                          }));
                          updateConfig("audioCustomSource", "");
                        }
                        setProbeAudioSource(!isProbing);
                        setConfig((config) => ({
                          ...config,
                          ...audioDefaults,
                          audioCustomSource: config.audioCustomSource,
                        }));
                      }}
                      variant="contained"
                      color="success"
                      sx={ProbeButtonSx}
                    >
                      <Box sx={ProbeButtonTextSx}>
                        <Typography variant="overline">
                          {!probeAudioSource && !config.audioCustomSource
                            ? "PROBE DIFFERENT AUDIO SOURCE"
                            : "USE DEFAULT SOURCE"}
                        </Typography>
                      </Box>
                    </Button>
                  ) : null}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {!probeAudioSource && streams.audioStreamsMapped?.length ? (
                  <>
                    <Stack spacing={1}>
                      <ComboBox
                        options={streams.audioStreamsMapped}
                        onChange={(e, value) => {
                          setConfig((config) => ({
                            ...config,
                            ...audioDefaults,
                            audioCustomSource: config.audioCustomSource,
                            audioStreamIndex: value.index,
                          }));
                        }}
                        label="Source"
                        value={
                          config.audioStreamIndex === null
                            ? streams.audioStreamsMapped[0]
                            : streams.audioStreamsMapped.find((s) => s.index === config.audioStreamIndex)
                        }
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <ComboBox
                        options={configs.audioEncodingOptions}
                        label="Codec"
                        onChange={(e, value) => updateConfig("audioEncodingPreset", value)}
                        value={config.audioEncodingPreset}
                      />
                    </Stack>
                    {config.audioEncodingPreset !== configs.audioEncodingOptions[0] && (
                      <>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          <TextField
                            onChange={(e) => updateConfig("audioAACBitrate", +e.target.value)}
                            label="Bitrate (kbps)"
                            value={config.audioAACBitrate}
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                          <TextField
                            label="Volume (dB)"
                            onChange={(e, value) => updateConfig("audioTranscodingVolume", +e.target.value)}
                            value={config.audioTranscodingVolume}
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        </Stack>
                        <Stack spacing={1}>
                          <FormControlLabel
                            onChange={(e) => updateConfig("audioTranscodingLoudnessNormalization", e.target.checked)}
                            control={<Checkbox checked={config.audioTranscodingLoudnessNormalization} />}
                            label={"Loudness normalization"}
                          />
                        </Stack>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <TextField
                      label="Audio source"
                      onChange={(e, value) => updateConfig("audioCustomSource", e.target.value)}
                      value={config.audioCustomSource}
                      type="text"
                      variant="outlined"
                      fullWidth
                    />
                    {validUrl(config.audioCustomSource) && config.audioCustomSource !== value && (
                      <ProbeObject
                        title="Probe audio source"
                        type="audio"
                        url={config.audioCustomSource}
                        setStreams={(audioStreams) => {
                          setProbeAudioSource((probeAudioSource) => {
                            if (!probeAudioSource && streams.audioStreams?.length) return;
                            setStreams((streams) => ({
                              ...streams,
                              ...audioStreams,
                            }));
                            if (!audioStreams.audioStreams.length) {
                              setTimeout(() => updateConfig("audioCustomSource", ""), 2500);
                            }
                            return false;
                          });
                        }}
                      />
                    )}
                  </>
                )}
              </Stack>
              <Button
                onClick={() => {
                  onSuccess({
                    ...config,
                    customHeaders: streams.customHeaders,
                    customAudioHeaders: streams.customAudioHeaders,
                    videoStreamProbeForceHLS: streams.videoStreamProbeForceHLS,
                    audioCustomSourceProbeForceHLS: streams.audioCustomSourceProbeForceHLS,
                  });
                  handleClose();
                }}
                variant="contained"
                color="success"
                sx={{ ...ProbeButtonSx, mt: 1 }}
                disabled={Boolean(config.audioCustomSource && config.audioStreamIndex === null)}
              >
                <Box sx={ProbeButtonTextSx}>
                  <Typography variant="overline">SAVE</Typography>
                </Box>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Probe;
