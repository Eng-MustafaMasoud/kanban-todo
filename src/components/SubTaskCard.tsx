"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { SubTask } from "@/lib/api";
import { useDraggable } from "@dnd-kit/core";

interface SubTaskCardProps {
  subTask: SubTask;
  onEdit: (subTask: SubTask) => void;
  onDelete: (id: number) => void;
}

export default function SubTaskCard({
  subTask,
  onEdit,
  onDelete,
}: SubTaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: subTask.id,
    data: {
      type: "SUBTASK",
      subTask,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "#ff6b6b";
      case "doing":
        return "#4ecdc4";
      case "done":
        return "#45b7d1";
      default:
        return "#667eea";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "doing":
        return "In Progress";
      case "done":
        return "Completed";
      default:
        return status;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked for subtask:", subTask);
    onEdit(subTask);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete button clicked for subtask:", subTask);
    onDelete(subTask.id);
  };

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        borderRadius: 3,
        border: (theme) =>
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 16px rgba(0,0,0,0.3)"
            : "0 4px 16px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "rotate(5deg) scale(0.95)" : "none",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.4)"
              : "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ p: 2.5, position: "relative" }}>
        {/* Status Chip and Action Buttons Row */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Chip
            label={getStatusLabel(subTask.status)}
            size="small"
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${getStatusColor(
                      subTask.status
                    )}20 0%, ${getStatusColor(subTask.status)}10 100%)`
                  : `linear-gradient(135deg, ${getStatusColor(
                      subTask.status
                    )}15 0%, ${getStatusColor(subTask.status)}08 100%)`,
              color: getStatusColor(subTask.status),
              fontWeight: 600,
              fontSize: "0.75rem",
              border: `1px solid ${getStatusColor(subTask.status)}30`,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />

          {/* Action Buttons - Always visible */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              opacity: isHovered ? 1 : 0.7,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <IconButton
              size="small"
              onClick={handleEditClick}
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
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                color: "error.main",
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
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Draggable Content Area */}
        <Box
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          sx={{
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          {/* Task Title */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              lineHeight: 1.4,
              color: "text.primary",
              wordBreak: "break-word",
            }}
          >
            {subTask.title}
          </Typography>

          {/* Drag Indicator */}
          <Box
            sx={{
              mt: 1,
              opacity: 0.3,
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            ⋮⋮
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
