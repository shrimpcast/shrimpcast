import { createTheme } from "@mui/material";
import * as colors from "@mui/material/colors";

const { blueGrey, orange } = colors;

const makeTheme = (configuration) => {
  const { palettePrimary, paletteSecondary } = configuration || {};
  let primary = colors[palettePrimary],
    secondary = colors[paletteSecondary],
    useDarkTheme = configuration?.useDarkTheme;

  if (!primary || !secondary) {
    primary = blueGrey;
    secondary = orange;
    useDarkTheme = true;
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
