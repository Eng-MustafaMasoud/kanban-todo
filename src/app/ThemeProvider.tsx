"use client";

import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, useMemo } from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { useTheme as useAppTheme } from "@/contexts/ThemeContext";

const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#dc004e",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
          },
        }
      : {
          // Dark mode
          primary: {
            main: "#90caf9",
          },
          secondary: {
            main: "#f48fb1",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "rgba(255, 255, 255, 0.7)",
          },
        }),
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        body: {
          transition: "background-color 0.3s ease, color 0.3s ease",
        },
      }),
    },
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, mounted } = useAppTheme();

  // Update the theme only if the mode changes
  const themeWithMode = useMemo(
    () => createTheme(getDesignTokens(theme)),
    [theme]
  );

  // Always render with light theme initially to prevent hydration mismatch
  const initialTheme = createTheme(getDesignTokens("light"));

  return (
    <MuiThemeProvider theme={mounted ? themeWithMode : initialTheme}>
      <EmotionThemeProvider theme={mounted ? themeWithMode : initialTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}
