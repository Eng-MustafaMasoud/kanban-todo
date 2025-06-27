"use client";

import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchTask } from "@/lib/api";
import TaskDetailsBoard from "@/components/TaskDetailsBoard";
import NotePenLoader from "@/components/NotePenLoader";

// Main page
export default function TaskDetailsPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Loading task with ID:", id);
        await fetchTask(id);
        console.log("Task data loaded successfully");
      } catch (err) {
        console.error("Error loading task:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

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
