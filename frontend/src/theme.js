import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#6C63FF",
    },

    secondary: {
      main: "#8B5CF6",
    },

    background: {
      default: "#0B0F17",
      paper: "#161B22",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#B8C0CC",
    },

    success: {
      main: "#22C55E",
    },

    warning: {
      main: "#F59E0B",
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 14,
  },
});

export default theme;