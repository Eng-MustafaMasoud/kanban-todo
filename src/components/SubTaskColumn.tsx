"use client";

import { Box, Typography, Paper, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { SubTask } from "@/lib/api";
import SubTaskCard from "./SubTaskCard";
import { useEffect } from "react";
import { SubTaskColumnType } from "./TaskDetailsBoard";
import { useDroppable } from "@dnd-kit/core";

interface SubTaskColumnProps {
  id: SubTaskColumnType;
  subTasks: SubTask[];
  onAddSubTask: (columnId: SubTaskColumnType) => void;
  onEditSubTask: (subTask: SubTask) => void;
  onDeleteSubTask: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  totalItems: number;
}

export default function SubTaskColumn({
  id,
  subTasks,
  onAddSubTask,
  onEditSubTask,
  onDeleteSubTask,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: SubTaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const getColumnTitle = (columnId: SubTaskColumnType) => {
    switch (columnId) {
      case "todo":
        return "To Do";
      case "doing":
        return "Doing";
      case "done":
        return "Done";
      default:
        return columnId;
    }
  };

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(1);
    }
  }, [subTasks.length, currentPage, totalPages, onPageChange]);

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
              background: () => {
                switch (id) {
                  case "todo":
                    return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
                  case "doing":
                    return "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)";
                  case "done":
                    return "linear-gradient(135deg, #45b7d1 0%, #96c93d 100%)";
                  default:
                    return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                }
              },
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {getColumnTitle(id)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {totalItems} {totalItems === 1 ? "subtask" : "subtasks"}
          </Typography>
        </Box>
        <IconButton
          onClick={() => onAddSubTask(id)}
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

      {/* Subtasks List */}
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
        {subTasks.length === 0 ? (
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
              📝
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              No subtasks yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click the + button to add one
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {subTasks.map((subTask) => (
              <SubTaskCard
                key={subTask.id}
                subTask={subTask}
                onEdit={onEditSubTask}
                onDelete={onDeleteSubTask}
                currentColumn={id}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination */}
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
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                    onClick={() => onPageChange(pageNum)}
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
                onPageChange(Math.min(totalPages, currentPage + 1))
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
