"use client";

import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskDetailsBoard from "@/components/TaskDetailsBoard";
import NotePenLoader from "@/components/NotePenLoader";

// Main page
export default function TaskDetailsPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(120deg, #181c21 0%, #23272f 100%)"
              : "linear-gradient(120deg, #f8fafc 0%, #e9ecef 100%)",
        }}
      >
        <CircularProgress />
        <Typography
          component="div"
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          <NotePenLoader />
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(120deg, #181c21 0%, #23272f 100%)"
            : "linear-gradient(120deg, #f8fafc 0%, #e9ecef 100%)",
      }}
    >
      {/* Board area */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <TaskDetailsBoard parentTaskId={id} />
      </Box>
    </Box>
  );
}
