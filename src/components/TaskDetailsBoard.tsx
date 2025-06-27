"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import SubTaskColumn from "./SubTaskColumn";
import SubTaskModal from "./SubTaskModal";
import { RootState, AppDispatch } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { Task, SubTask } from "@/lib/api";
import { editTask, fetchTasks } from "@/store/tasksSlice";

export type SubTaskColumnType = "todo" | "doing" | "done";
export const SUB_TASK_COLUMNS: SubTaskColumnType[] = ["todo", "doing", "done"];

// Wrapper component to handle client-side only rendering
export default function TaskDetailsBoard({
  parentTaskId,
}: {
  parentTaskId: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading subtasks...
        </Typography>
      </Box>
    );
  }

  return <TaskDetailsBoardContent parentTaskId={parentTaskId} />;
}

// Client-side only board implementation
function TaskDetailsBoardContent({ parentTaskId }: { parentTaskId: string }) {
  const [editingSubTask, setEditingSubTask] = useState<SubTask | undefined>(
    undefined
  );
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<
    Record<SubTaskColumnType, number>
  >({
    todo: 1,
    doing: 1,
    done: 1,
  });
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const isLoading = useSelector((state: RootState) => state.tasks.loading);

  const ITEMS_PER_PAGE = 5;

  // Fetch tasks if not already loaded
  useEffect(() => {
    if (tasks.length === 0 && !isLoading) {
      console.log("No tasks in store, fetching tasks...");
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length, isLoading]);

  // Get the parent task
  const parentTask = useMemo(() => {
    console.log("Looking for parent task with ID:", parentTaskId);
    console.log("Available tasks:", tasks);
    return tasks.find((t: Task) => String(t.id) === String(parentTaskId));
  }, [tasks, parentTaskId]);

  // Get subtasks for each column with search filter and pagination
  const getSubTasksByColumn = (column: SubTaskColumnType) => {
    if (!parentTask?.subtasks) return [];
    const filteredSubTasks = parentTask.subtasks.filter((subtask: SubTask) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        subtask.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesColumn = subtask.status === column;
      return matchesSearch && matchesColumn;
    });
    return filteredSubTasks;
  };

  // Get paginated subtasks for a specific column
  const getPaginatedSubTasks = (column: SubTaskColumnType) => {
    const allSubTasks = getSubTasksByColumn(column);
    const startIndex = (pagination[column] - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allSubTasks.slice(startIndex, endIndex);
  };

  // Get total pages for a column
  const getTotalPages = (column: SubTaskColumnType) => {
    const totalItems = getSubTasksByColumn(column).length;
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  // Handle page change for a specific column
  const handlePageChange = (column: SubTaskColumnType, newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      [column]: newPage,
    }));
  };

  // Reset pagination when search changes
  useEffect(() => {
    setPagination({
      todo: 1,
      doing: 1,
      done: 1,
    });
  }, [searchQuery]);

  // Handlers
  //   handle add subTask
  const handleAddSubTask = () => {
    setIsAddingSubTask(true);
    setEditingSubTask(undefined);
  };
  //   handle editbTask

  const handleEditSubTask = (subTask: SubTask) => {
    setIsAddingSubTask(false);
    setEditingSubTask(subTask);
  };

  const handleSubTaskSubmit = async (
    values: Omit<SubTask, "id">,
    subTaskId?: number
  ) => {
    if (!parentTask) return;

    setIsSubmitting(true);
    try {
      const updatedSubTasks = parentTask.subtasks
        ? [...parentTask.subtasks]
        : [];

      if (subTaskId) {
        // Edit existing subtask
        const index = updatedSubTasks.findIndex((st) => st.id === subTaskId);
        if (index !== -1) {
          updatedSubTasks[index] = { ...values, id: subTaskId };
        }
      } else {
        // Add new subtask
        updatedSubTasks.push({ ...values, id: Date.now() });
      }

      const updatedTask = {
        ...parentTask,
        subtasks: updatedSubTasks,
      };

      await dispatch(editTask(updatedTask)).unwrap();
      setEditingSubTask(undefined);
      setIsAddingSubTask(false);
    } catch (error) {
      console.error("Error submitting subtask:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  //   handle deletebTask

  const handleDeleteSubTask = async (subTaskId: number) => {
    if (!parentTask) return;

    setIsSubmitting(true);
    try {
      const updatedSubTasks =
        parentTask.subtasks?.filter((st) => st.id !== subTaskId) || [];
      const updatedTask = {
        ...parentTask,
        subtasks: updatedSubTasks,
      };

      await dispatch(editTask(updatedTask)).unwrap();
      setEditingSubTask(undefined);
      setIsAddingSubTask(false);
    } catch (error) {
      console.error("Error deleting subtask:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move subtask to a new column when dropped
  const moveSubTask = async (
    subTaskId: number,
    newColumn: SubTaskColumnType
  ) => {
    if (!parentTask) return;
    const updatedSubTasks =
      parentTask.subtasks?.map((subtask: SubTask) => {
        if (subtask.id === subTaskId) {
          return {
            ...subtask,
            status: newColumn,
          };
        }
        return subtask;
      }) || [];
    const updatedTask = {
      ...parentTask,
      subtasks: updatedSubTasks,
    };
    try {
      await dispatch(editTask(updatedTask)).unwrap();
    } catch (error) {
      console.error("Error moving subtask:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const subTaskId = active.id as number;
    const newColumn = over.id as SubTaskColumnType;

    // Only move if dropping on a valid column
    if (SUB_TASK_COLUMNS.includes(newColumn)) {
      await moveSubTask(subTaskId, newColumn);
    }
  };

  // Handle main task status change
  const handleMainTaskStatusChange = async (
    newStatus: "backlog" | "in_progress" | "review" | "done"
  ) => {
    if (!parentTask) return;

    setIsSubmitting(true);
    try {
      const updatedTask = {
        ...parentTask,
        status: newStatus,
        column: newStatus, // Also update the column to match
      };

      await dispatch(editTask(updatedTask)).unwrap();
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get column color for visual display
  const getColumnColor = (column: string) => {
    switch (column) {
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
  };

  const getColumnLabel = (column: string) => {
    switch (column) {
      case "backlog":
        return "Backlog";
      case "in_progress":
        return "In Progress";
      case "review":
        return "Review";
      case "done":
        return "Done";
      default:
        return column;
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!parentTask) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="error">
          Parent task not found
        </Typography>
      </Box>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Box sx={{ p: 4, maxWidth: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 4,
            gap: { xs: 2, md: 3 },
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
                : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="700"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              {parentTask?.title || "Task Details"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {parentTask?.description ||
                "Manage and organize your task breakdown"}
            </Typography>

            {/* Main Task Status */}
            {parentTask && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: { xs: 1, sm: 2 },
                  flexWrap: "wrap",
                }}
              >
                {/* Current Column Display */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 0.5, sm: 2 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Current Column:
                  </Typography>
                  <Chip
                    label={getColumnLabel(parentTask.column || "backlog")}
                    size="small"
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${getColumnColor(
                              parentTask.column || "backlog"
                            )}20 0%, ${getColumnColor(
                              parentTask.column || "backlog"
                            )}10 100%)`
                          : `linear-gradient(135deg, ${getColumnColor(
                              parentTask.column || "backlog"
                            )}15 0%, ${getColumnColor(
                              parentTask.column || "backlog"
                            )}08 100%)`,
                      color: getColumnColor(parentTask.column || "backlog"),
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      border: `1px solid ${getColumnColor(
                        parentTask.column || "backlog"
                      )}30`,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 0.5, sm: 2 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Move to Column:
                  </Typography>
                  <FormControl
                    size="small"
                    sx={{ minWidth: { xs: "100%", sm: 150 } }}
                  >
                    <Select
                      value={parentTask.column || "backlog"}
                      onChange={(e) =>
                        handleMainTaskStatusChange(
                          e.target.value as
                            | "backlog"
                            | "in_progress"
                            | "review"
                            | "done"
                        )
                      }
                      disabled={isSubmitting}
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover": {
                          background: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <MenuItem value="backlog">Backlog</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="review">Review</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </Box>

          <TextField
            placeholder="Search subtasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              minWidth: { xs: "100%", md: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                border: "none",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                },
                "&.Mui-focused": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.06)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 0 2px rgba(102, 126, 234, 0.3)"
                      : "0 0 0 2px rgba(102, 126, 234, 0.2)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
              ),
            }}
          />
        </Box>

        {/* Board */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          gap={{ xs: 2, sm: 3 }}
          sx={{
            overflowX: { xs: "visible", lg: "auto" },
            overflowY: { xs: "visible", lg: "hidden" },
            pb: 2,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              borderRadius: 4,
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          {SUB_TASK_COLUMNS?.map((columnId) => (
            <Box
              key={columnId}
              sx={{
                width: { xs: "100%", lg: 350 },
                minWidth: { lg: 350 },
                flex: { lg: 1 },
              }}
            >
              <SubTaskColumn
                id={columnId}
                onAddSubTask={handleAddSubTask}
                onEditSubTask={handleEditSubTask}
                onDeleteSubTask={handleDeleteSubTask}
                subTasks={getPaginatedSubTasks(columnId)}
                currentPage={pagination[columnId]}
                totalPages={getTotalPages(columnId)}
                onPageChange={(newPage) => handlePageChange(columnId, newPage)}
                totalItems={getSubTasksByColumn(columnId).length}
              />
            </Box>
          ))}
        </Box>

        {/* SubTask Modal */}
        <SubTaskModal
          open={!!editingSubTask || isAddingSubTask}
          onClose={() => {
            setEditingSubTask(undefined);
            setIsAddingSubTask(false);
          }}
          onSubmit={handleSubTaskSubmit}
          subTask={editingSubTask}
          isSubmitting={isSubmitting}
          onDelete={async (id) => handleDeleteSubTask(id)}
        />
      </Box>
    </DndContext>
  );
}
