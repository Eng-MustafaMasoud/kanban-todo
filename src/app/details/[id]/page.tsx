"use client";
// subtasks page
import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import TaskStatusBoard from "@/features/tasks/TaskStatusBoard";
import { useParams } from "next/navigation";

export default function TaskDetailsStandalonePage() {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  useEffect(() => setMounted(true), []);
  const hasId = Boolean(id);
  if (!mounted) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(120deg, #181c21 0%, #23272f 100%)"
            : "linear-gradient(120deg, #f8fafc 0%, #e9ecef 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      {hasId ? (
        <TaskStatusBoard taskId={id} />
      ) : (
        <Box color="error.main" fontSize={20}>
          Invalid task ID
        </Box>
      )}
    </Box>
  );
}
