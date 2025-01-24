// frontend/src/theme/theme.js
import { createTheme } from "@mui/material/styles";

// Define your custom color palette centered around red, white, and black
const theme = createTheme({
  palette: {
    primary: {
      main: "#cc2222", // Red
      contrastText: "#ffffff", // White text on red
    },
    secondary: {
      main: "#000000", // Black
      contrastText: "#ffffff", // White text on black
    },
    background: {
      default: "#ffffff", // White background
      paper: "#ffffff", // White paper background
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#555555", // Gray text for secondary information
    },
    // Optional: Define additional colors if needed
    error: {
      main: "#f44336", // Standard error color (can be customized)
    },
    warning: {
      main: "#ff9800", // Standard warning color
    },
    info: {
      main: "#2196f3", // Standard info color
    },
    success: {
      main: "#4caf50", // Standard success color
    },
  },
  typography: {
    // Customize typography as needed
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: 600, // Example: Make h6 headers slightly bolder
    },
  },
  components: {
    // Optional: Override default component styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for all buttons
          textTransform: "none", // Keep button text casing as is
        },
        containedPrimary: {
          backgroundColor: "#cc2222",
          "&:hover": {
            backgroundColor: "#b21f1f", // Darker red on hover
          },
        },
        containedSecondary: {
          backgroundColor: "#000000",
          "&:hover": {
            backgroundColor: "#333333", // Darker black (dark gray) on hover
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none", // Remove default AppBar shadow
        },
      },
    },
    // Add more component overrides as needed
  },
});

export default theme;
