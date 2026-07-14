import { Box, Typography } from "@mui/material";

const LabelContainerSx = (isGolden) => ({
    backgroundColor: "#121212",
    height: "13.5px",
    borderRadius: "2.5px",
    display: "inline-block",
    position: "relative",
    left: isGolden ? "1px" : "-1.5px",
  }),
  LabelSx = (color) => ({
    fontSize: "10px",
    position: "relative",
    bottom: "6.5px",
    fontWeight: "bold",
    color: color,
    pl: "3px",
    pr: "3px",
  });

const UserLabel = (props) => {
  const { label, color, isGolden } = props;

  return label ? (
    <Box sx={{ height: "13.5px", mb: "2.5px" }}>
      <Box sx={LabelContainerSx(isGolden)}>
        <Typography className="noselect" variant="overline" sx={LabelSx(color)}>
          {label}
        </Typography>
      </Box>
    </Box>
  ) : null;
};

export default UserLabel;
