"use client";

import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";

export default function TasksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3, md: 4 },
        background: "transparent",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          textAlign: "center",
          maxWidth: { xs: "100%", sm: 500, md: 600 },
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: { xs: 2, sm: 3, md: 4 },
          border: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            fontSize: { xs: 64, sm: 80, md: 96 },
            mb: { xs: 2, sm: 3 },
            opacity: 0.7,
            color: "primary.main",
          }}
        >
          🚧
        </Box>

        {/* Title */}
        <Typography
          variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
          component="h1"
          sx={{
            fontWeight: 700,
            mb: { xs: 1, sm: 2 },
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Coming Soon
        </Typography>

        {/* Subtitle */}
        <Typography
          variant={isMobile ? "body1" : "h6"}
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 3 },
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          The Tasks page is under construction
        </Typography>

        {/* Description */}
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color="text.secondary"
          sx={{
            opacity: 0.7,
            lineHeight: 1.6,
            mb: { xs: 3, sm: 4 },
          }}
        >
          We&apos;re working hard to bring you an enhanced task management
          experience. For now, you can use the main Kanban board to organize
          your tasks.
        </Typography>

        {/* Action Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              color: "text.secondary",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => window.history.back()}
          >
            Go Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              background: "primary.main",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "primary.dark",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => (window.location.href = "/")}
          >
            Back to Dashboard
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
