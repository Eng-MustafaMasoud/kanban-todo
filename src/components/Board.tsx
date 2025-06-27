"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery, Paper } from "@mui/material";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { Task } from "@/lib/api";
import { addTask, editTask, deleteTask, fetchTasks } from "@/store/tasksSlice";
import { fetchColumns } from "@/store/columnsSlice";
import NotePenLoader from "./NotePenLoader";

// ColumnType from ColumnProps
export type ColumnType = "backlog" | "in_progress" | "review" | "done";
export const COLUMNS: ColumnType[] = [
  "backlog",
  "in_progress",
  "review",
  "done",
];

const Board: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const columnsLoading = useSelector(
    (state: RootState) => state.columns.loading
  );
  const tasksLoading = useSelector((state: RootState) => state.tasks.loading);
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (mounted) {
      dispatch(fetchColumns());
      dispatch(fetchTasks());
    }
  }, [dispatch, mounted]);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(
    (task: Task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers for Column
  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedTaskId(String(task.id));
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log("handleDeleteTask called:", { taskId, type: typeof taskId });
      setIsSubmitting(true);
      const result = await dispatch(deleteTask(taskId)).unwrap();
      console.log("Task deleted successfully:", result);
      setSelectedTaskId(undefined);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveTask = async (taskId: string, newColumn: ColumnType) => {
    console.log("handleMoveTask called:", { taskId, newColumn });
    const task = tasks.find((t) => String(t.id) === String(taskId));
    console.log("Found task:", task);

    if (task && task.column !== newColumn) {
      try {
        console.log("Moving task from", task.column, "to", newColumn);
        const result = await dispatch(
          editTask({ ...task, column: newColumn })
        ).unwrap();
        console.log("Task moved successfully:", result);
      } catch (error) {
        console.error("Failed to move task:", error);
      }
    } else {
      console.log("Task not found or already in target column");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const taskId = active.id as string;
    const newColumn = over.id as ColumnType;

    // Only move if dropping on a valid column
    if (COLUMNS.includes(newColumn)) {
      await handleMoveTask(taskId, newColumn);
    }
  };

  const handleSubmitTask = async (
    values: Omit<Task, "id">,
    taskId?: string
  ) => {
    try {
      setIsSubmitting(true);
      console.log("=== BOARD SUBMIT DEBUG ===");
      console.log("Received values:", values);
      console.log("Received taskId:", taskId);
      console.log("TaskId type:", typeof taskId);
      console.log("Editing task:", editingTask);
      console.log("Is edit mode:", !!taskId);

      if (taskId) {
        // Edit existing task
        console.log("EDITING EXISTING TASK with ID:", taskId);
        const taskToEdit = { ...values, id: taskId };
        console.log("Task to edit:", taskToEdit);
        const result = await dispatch(editTask(taskToEdit)).unwrap();
        console.log("Task edited successfully:", result);
      } else {
        // Add new task
        console.log("CREATING NEW TASK");
        const result = await dispatch(addTask(values)).unwrap();
        console.log("Task created successfully:", result);
      }
      console.log("=== END BOARD DEBUG ===");

      setIsModalOpen(false);
      setEditingTask(null);
      setSelectedTaskId(undefined);
    } catch (error) {
      console.error("Failed to save task:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedTaskId(undefined);
  };

  // Show loading state
  if (columnsLoading || tasksLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography component="div">
          <NotePenLoader />
        </Typography>
      </Box>
    );
  }

  // Don't render DndProvider until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 1, sm: 2, md: 3 },
          background: "transparent",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
            component="h1"
            sx={{
              fontWeight: 700,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: { xs: 1, sm: 2 },
            }}
          >
            Kanban Board
          </Typography>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            color="text.secondary"
            sx={{ opacity: 0.8 }}
          >
            Organize your tasks with drag and drop
          </Typography>
        </Box>

        {/* Board Layout */}
        <Box
          className="kanaban-columns"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2, sm: 3 },
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          {COLUMNS.map((columnId) => (
            <Column
              key={columnId}
              id={columnId}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              selectedTaskId={selectedTaskId}
              search={searchTerm}
            />
          ))}
        </Box>

        {/* Empty State */}
        {filteredTasks.length === 0 && searchTerm && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              textAlign: "center",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ mb: 1, fontWeight: 600 }}
            >
              No tasks found
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "body1"}
              color="text.secondary"
            >
              Try adjusting your search terms or create a new task
            </Typography>
          </Paper>
        )}

        {/* Task Modal */}
        <TaskModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
          task={editingTask}
          isSubmitting={isSubmitting}
        />
      </Box>
    </DndContext>
  );
};

export default Board;
