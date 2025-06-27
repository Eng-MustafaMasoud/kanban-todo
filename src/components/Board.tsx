"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { Task } from "@/lib/api";
import { addTask, editTask, deleteTask, fetchTasks } from "@/store/tasksSlice";
import { fetchColumns } from "@/store/columnsSlice";
import NotePenLoader from "./NotePenLoader";
import TaskCard from "./TaskCard";

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
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Configure sensors for better performance and reliability
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Very small distance for easier activation
      },
    }),
    useSensor(KeyboardSensor)
  );

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const columnsLoading = useSelector(
    (state: RootState) => state.columns.loading
  );
  const tasksLoading = useSelector((state: RootState) => state.tasks.loading);
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");

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

  // Memoize filtered tasks to prevent recalculation on every render
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // Handlers for Column
  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        setIsSubmitting(true);
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch]
  );

  const handleMoveTask = useCallback(
    async (taskId: string, newColumn: ColumnType) => {
      const task = tasks.find((t) => String(t.id) === String(taskId));

      if (!task) {
        console.error("Task not found:", taskId);
        return;
      }

      if (task.column === newColumn) {
        return; // Task already in target column
      }

      try {
        await dispatch(
          editTask({ ...task, column: newColumn, status: newColumn })
        ).unwrap();
      } catch (error) {
        console.error("Failed to move task:", error);
      }
    },
    [tasks, dispatch]
  );

  // Simplified drag handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const taskId = active.id as string;
      const found = tasks.find((t) => String(t.id) === String(taskId));
      setActiveTask(found || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;

      if (!over || !active) {
        return;
      }

      const taskId = active.id as string;
      const newColumn = over.id as ColumnType;

      if (COLUMNS.includes(newColumn)) {
        await handleMoveTask(taskId, newColumn);
      }
    },
    [handleMoveTask]
  );

  const handleSubmitTask = useCallback(
    async (values: Omit<Task, "id">, taskId?: string) => {
      try {
        setIsSubmitting(true);

        if (taskId) {
          // Editing existing task
          const taskToEdit = tasks.find((t) => String(t.id) === String(taskId));
          if (taskToEdit) {
            await dispatch(
              editTask({
                ...taskToEdit,
                ...values,
              })
            ).unwrap();
          }
        } else {
          // Creating new task
          await dispatch(addTask(values)).unwrap();
        }

        setIsModalOpen(false);
        setEditingTask(null);
      } catch (error) {
        console.error("Failed to save task:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [tasks, dispatch]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // Don't render anything on the server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (columnsLoading || tasksLoading) {
    return <NotePenLoader />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            color: "text.primary",
          }}
        >
          Kanban Board
        </Typography>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
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
          {COLUMNS.map((columnType) => (
            <Column
              key={columnType}
              type={columnType}
              tasks={filteredTasks.filter((task) => task.column === columnType)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
};

export default Board;
