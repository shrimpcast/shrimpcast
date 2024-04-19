import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const ColorButtonSx = {
    width: "100%",
    height: "20px",
    borderRadius: "0px",
    borderBottomRightRadius: "0px",
  },
  ColorButtonTextSx = {
    fontSize: "12px",
    fontWeight: "bold",
    position: "absolute",
    top: "1px",
  },
  NotifIconSx = {
    position: "relative",
    top: "2px",
    ml: 1,
    fontSize: "14px",
  },
  CloseIconSx = (palette) => ({
    zIndex: "2",
    backgroundColor: palette["A700"],
    height: "20px",
    width: "20px",
    fontSize: "14px",
  }),
  LoaderSx = {
    position: "relative",
    top: "2px",
    left: "5px",
    color: "inherit",
  },
  ColorButton = styled(Button)(({ theme, palette }) => ({
    color: theme.palette.getContrastText(palette["A400"]),
    backgroundColor: palette["A400"],
    "&:hover": {
      backgroundColor: palette["A700"],
    },
  }));

const NotificationBar = (props) => {
  const Icon = props.icon;
  const { palette } = props;

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <ColorButton palette={palette} onClick={props.onClick} sx={ColorButtonSx} size="large" variant="contained">
        <Typography sx={ColorButtonTextSx}>
          {props.text}
          {props.loading ? <CircularProgress size={14} sx={LoaderSx} /> : <Icon sx={NotifIconSx} />}
        </Typography>
      </ColorButton>
      <IconButton onClick={props.close} type="button" size="small" sx={{ p: 0 }}>
        <CloseIcon sx={CloseIconSx(palette)} />
      </IconButton>
    </Box>
  );
};

export default NotificationBar;
