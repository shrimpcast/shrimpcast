import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const ColorButtonSx = {
    width: "100%",
    borderRadius: "0px",
    borderBottomRightRadius: "0px",
    padding: "0px",
  },
  ColorButtonTextSx = {
    fontSize: "12px",
    fontWeight: "bold",
    pl: "2.5px",
    pr: "2.5px",
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
  const { palette, skipCloseButton } = props;

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <ColorButton palette={palette} onClick={props.onClick} sx={ColorButtonSx} size="large" variant="contained">
        <Typography sx={ColorButtonTextSx}>
          {props.text}
          {props.loading ? <CircularProgress size={14} sx={LoaderSx} /> : <Icon sx={NotifIconSx} />}
        </Typography>
      </ColorButton>
      {!skipCloseButton && (
        <IconButton onClick={props.close} type="button" size="small" sx={{ p: 0 }}>
          <CloseIcon sx={CloseIconSx(palette)} />
        </IconButton>
      )}
    </Box>
  );
};

export default NotificationBar;
