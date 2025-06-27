"use client";

import { ThemeProvider } from "./ThemeProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ReduxProvider } from "@/store/provider";
import { ThemeProvider as ThemeContextProvider } from "@/contexts/ThemeContext";
import NavBar from "@/components/NavBar";
import { Box, Container, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

function ClientContent({ children }: { children: ReactNode }) {
  const { mounted } = useTheme();

  // Don't render theme-dependent content until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 1, sm: 2 },
            pb: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              px: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 2 },
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 1, sm: 2 },
          pb: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: "calc(100vh - 64px)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 2 },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeContextProvider>
        <ReactQueryProvider>
          <ThemeProvider>
            <CssBaseline />
            <ClientContent>{children}</ClientContent>
          </ThemeProvider>
        </ReactQueryProvider>
      </ThemeContextProvider>
    </ReduxProvider>
  );
}
