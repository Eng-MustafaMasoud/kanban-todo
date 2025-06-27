"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Task } from "@/lib/api";
import { useDraggable, DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  selected?: boolean;
  disableCardClick?: boolean;
  dragHandleProps?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  selected = false,
  disableCardClick = false,
  dragHandleProps,
  listeners,
}: TaskCardProps) {
  // @dnd-kit drag source
  const {
    attributes,
    listeners: dragListeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: String(task.id),
  });

  // Use provided listeners and attributes if available (for TaskStatusBoard)
  const finalListeners = listeners || dragListeners;
  const finalAttributes = dragHandleProps || attributes;
  const finalRef = setNodeRef;

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(task);
    },
    [onEdit, task]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(String(task.id));
    },
    [onDelete, task.id]
  );

  const router = useRouter();
  const handleCardClick = useCallback(() => {
    router.push(`/tasks/${task.id}`);
  }, [router, task.id]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "backlog":
        return "#ff6b6b";
      case "in_progress":
        return "#4ecdc4";
      case "review":
        return "#feca57";
      case "done":
        return "#45b7d1";
      default:
        return "#667eea";
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "backlog":
        return "Backlog";
      case "in_progress":
        return "In Progress";
      case "review":
        return "Review";
      case "done":
        return "Done";
      default:
        return status;
    }
  }, []);

  // Memoize status calculations
  const { statusColor, statusLabel } = useMemo(() => {
    const displayStatus = task.column || task.status;
    const statusColor = getStatusColor(displayStatus);
    const statusLabel = getStatusLabel(displayStatus);
    return { statusColor, statusLabel };
  }, [task.column, task.status, getStatusColor, getStatusLabel]);

  return (
    <Card
      ref={finalRef}
      {...finalAttributes}
      {...finalListeners}
      {...(!disableCardClick ? { onClick: handleCardClick } : {})}
      sx={{
        position: "relative",
        cursor: "grab",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        borderRadius: { xs: 2, sm: 3 },
        border: selected
          ? (theme) => `2px solid ${theme.palette.primary.main}`
          : (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
        boxShadow: (theme) =>
          selected
            ? theme.palette.mode === "dark"
              ? "0 8px 24px rgba(25, 118, 210, 0.3)"
              : "0 8px 24px rgba(25, 118, 210, 0.2)"
            : theme.palette.mode === "dark"
            ? "0 4px 16px rgba(0,0,0,0.3)"
            : "0 4px 16px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "rotate(5deg)" : "none",
        transition: "all 0.2s ease",
        "&:active": {
          cursor: "grabbing",
        },
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-2px)" },
          boxShadow: (theme) =>
            selected
              ? theme.palette.mode === "dark"
                ? "0 12px 32px rgba(25, 118, 210, 0.4)"
                : "0 12px 32px rgba(25, 118, 210, 0.25)"
              : theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.4)"
              : "0 8px 24px rgba(0,0,0,0.12)",
          "& .card-actions": {
            opacity: 1,
          },
        },
      }}
      className={`task-card ${isDragging ? "dragging" : ""}`}
    >
      <CardContent sx={{ p: 2.5, position: "relative" }}>
        {/* Status Chip */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}10 100%)`
                  : `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}08 100%)`,
              color: statusColor,
              fontWeight: 600,
              fontSize: "0.75rem",
              border: `1px solid ${statusColor}30`,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />

          {/* Action Buttons */}
          <Box
            className="card-actions"
            sx={{
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                color: (theme) => theme.palette.primary.main,
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.08)",
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                color: (theme) => theme.palette.error.main,
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.08)",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Task Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "text.primary",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title}
        </Typography>

        {/* Task Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: { xs: "0.875rem", sm: "0.9rem" },
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Task ID */}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            fontSize: "0.75rem",
            fontFamily: "monospace",
          }}
        >
          ID: {task.id}
        </Typography>
      </CardContent>
    </Card>
  );
}
