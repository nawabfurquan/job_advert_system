import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    header: string;
    body: string;
  }

  interface PaletteOptions {
    header?: string;
    body?: string;
  }
}

const theme = createTheme({
  palette: {
    header: "#054078",
    body: "#f0f4f8",
    primary: {
      main: "#0357a6",
    },
  },
});

export default theme;
