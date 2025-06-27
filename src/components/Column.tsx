"use client";

import { Box, Typography, Paper, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Task } from "@/lib/api";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState, useEffect, useCallback } from "react";
import { ColumnType } from "./Board";

interface ColumnProps {
  type: ColumnType;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isMobile?: boolean;
}

const columnTitles: Record<ColumnType, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const getColumnColor = (columnId: ColumnType) => {
  switch (columnId) {
    case "backlog":
      return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
    case "in_progress":
      return "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)";
    case "review":
      return "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)";
    case "done":
      return "linear-gradient(135deg, #45b7d1 0%, #96c93d 100%)";
    default:
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
};

export default function Column({
  type,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isMobile = false,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: type,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Memoize paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, currentPage]);

  // Calculate pagination info
  const totalItems = tasks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [tasks.length, currentPage, totalPages]);

  // Memoize pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleAddTaskClick = useCallback(() => {
    onAddTask();
  }, [onAddTask]);

  // Memoize column title and color
  const { columnTitle, columnColor } = useMemo(() => {
    return {
      columnTitle: columnTitles[type],
      columnColor: getColumnColor(type),
    };
  }, [type]);

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        width: { xs: "100%", sm: 320, md: 350 },
        minHeight: { xs: 400, sm: 500, md: 600 },
        display: "flex",
        flexDirection: "column",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        borderRadius: { xs: 2, sm: 3, md: 4 },
        border: (theme) =>
          isOver
            ? `2px solid ${theme.palette.primary.main}`
            : theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
        boxShadow: (theme) =>
          isOver
            ? theme.palette.mode === "dark"
              ? "0 12px 40px rgba(25, 118, 210, 0.3)"
              : "0 12px 40px rgba(25, 118, 210, 0.2)"
            : theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
            : "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isOver ? "scale(1.02)" : "none",
        "&:hover": {
          transform: {
            xs: "none",
            sm: isOver ? "scale(1.02)" : "translateY(-2px)",
          },
          boxShadow: (theme) =>
            isOver
              ? theme.palette.mode === "dark"
                ? "0 12px 40px rgba(25, 118, 210, 0.4)"
                : "0 12px 40px rgba(25, 118, 210, 0.25)"
              : theme.palette.mode === "dark"
              ? "0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)"
              : "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          background: columnColor,
          borderRadius: {
            xs: "8px 8px 0 0",
            sm: "12px 12px 0 0",
            md: "16px 16px 0 0",
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: 60, sm: 70 },
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h2"
          sx={{
            fontWeight: 700,
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {columnTitle}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Task Count */}
          <Typography
            variant="caption"
            sx={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.75rem",
              backdropFilter: "blur(10px)",
            }}
          >
            {totalItems}
          </Typography>

          {/* Add Task Button */}
          <IconButton
            onClick={handleAddTaskClick}
            sx={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Column Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 1.5, sm: 2 },
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* Tasks List */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                No tasks yet
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Click the + button to add one
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              borderTop: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <Typography variant="caption" color="text.secondary">
              {currentPage} of {totalPages}
            </Typography>

            <IconButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
