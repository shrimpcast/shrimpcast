import { createTheme } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";

const makeTheme = (configuration) => {
  const { palettePrimary, paletteSecondary } = configuration || {};
  let primary,
    secondary,
    useDarkTheme = configuration?.useDarkTheme;

  try {
    primary = require(`@mui/material/colors/${palettePrimary}.js`).default;
    secondary = require(`@mui/material/colors/${paletteSecondary}.js`).default;
  } catch (e) {
    primary = blueGrey;
    secondary = orange;
    useDarkTheme = true;
    console.log("Using default theme due to corrupted palette.");
  }

  return createTheme({
    palette: {
      mode: useDarkTheme ? "dark" : "light",
      primary,
      secondary,
      background: {
        default: primary[900],
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1600,
      },
    },
  });
};

export default makeTheme;
