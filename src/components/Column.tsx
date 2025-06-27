"use client";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Task } from "@/lib/api";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState, useEffect } from "react";
import { COLUMNS, ColumnType } from "./Board";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ColumnProps {
  id: ColumnType;
  onAddTask: (columnId: ColumnType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  selectedTaskId?: string;
  search?: string;
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
  id,
  onAddTask,
  onEditTask,
  onDeleteTask,
  selectedTaskId,
  search = "",
}: ColumnProps) {
  // Get tasks from Redux state
  const allTasks = useSelector((state: RootState) => state.tasks.tasks);
  const isLoading = useSelector((state: RootState) => state.tasks.loading);

  const { setNodeRef } = useDroppable({
    id: id,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Ensure we have a valid column ID
  const columnId = COLUMNS.includes(id) ? id : "backlog";

  // Filter tasks for this column and search
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task: Task) => {
      const matchesColumn = task.column === id;
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      return matchesColumn && matchesSearch;
    });
  }, [allTasks, id, search]);

  // Get paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage]);

  // Calculate pagination info
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredTasks.length, currentPage, totalPages]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Load more function for infinite scroll
  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events when the column is focused
      const columnElement = document.querySelector(`[data-column-id="${id}"]`);
      if (!columnElement?.contains(document.activeElement)) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setCurrentPage((prev) => Math.max(1, prev - 1));
          break;
        case "ArrowRight":
          event.preventDefault();
          setCurrentPage((prev) => Math.min(totalPages, prev + 1));
          break;
        case "Home":
          event.preventDefault();
          setCurrentPage(1);
          break;
        case "End":
          event.preventDefault();
          setCurrentPage(totalPages);
          break;
        default:
          // Handle number keys 1-9 for direct page navigation
          const pageNum = parseInt(event.key);
          if (pageNum >= 1 && pageNum <= Math.min(9, totalPages)) {
            event.preventDefault();
            setCurrentPage(pageNum);
          }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [id, totalPages]);

  return (
    <Paper
      ref={setNodeRef}
      data-column-id={id}
      tabIndex={0}
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
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
            : "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-2px)" },
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)"
              : "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              background: getColumnColor(columnId),
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {columnTitles[columnId]}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {totalItems} {totalItems === 1 ? "task" : "tasks"}
          </Typography>
        </Box>
        <IconButton
          onClick={() => onAddTask(id)}
          size="small"
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            color: "primary.main",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.08)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Tasks List */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          minHeight: 400,
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
            borderRadius: 3,
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : paginatedTasks.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                fontSize: 48,
                mb: 2,
                opacity: 0.5,
              }}
            >
              📋
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              No tasks yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click the + button to add one
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={() => onDeleteTask(String(task.id))}
                selected={String(task.id) === String(selectedTaskId)}
              />
            ))}
            {currentPage < totalPages && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={loadMore}
              >
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    fontWeight: 500,
                  }}
                >
                  Load more ({currentPage}/{totalPages})
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Pagination Info */}
      {totalPages > 1 && (
        <Box
          sx={{
            p: 2,
            borderTop: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.01)",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {/* Page Info */}
          <Typography
            variant="body2"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              fontWeight: 500,
            }}
          >
            Page {currentPage} of {totalPages}
          </Typography>

          {/* Navigation Controls */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Previous Button */}
            <IconButton
              size="small"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                color: currentPage === 1 ? "text.disabled" : "primary.main",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.08)",
                },
                "&:disabled": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            {/* Page Numbers */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <IconButton
                    key={pageNum}
                    size="small"
                    onClick={() => setCurrentPage(pageNum)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      background:
                        currentPage === pageNum
                          ? "primary.main"
                          : (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.05)",
                      color:
                        currentPage === pageNum ? "white" : "text.secondary",
                      fontWeight: currentPage === pageNum ? 600 : 400,
                      "&:hover": {
                        background:
                          currentPage === pageNum
                            ? "primary.dark"
                            : (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.15)"
                                  : "rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    {pageNum}
                  </IconButton>
                );
              })}
            </Box>

            {/* Next Button */}
            <IconButton
              size="small"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                color:
                  currentPage === totalPages ? "text.disabled" : "primary.main",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.08)",
                },
                "&:disabled": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
