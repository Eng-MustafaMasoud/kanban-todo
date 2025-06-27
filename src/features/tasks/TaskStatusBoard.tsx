"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTask,
  updateTask,
  deleteTask as apiDeleteTask,
  Task,
} from "@/lib/api";
import { Box, Typography, Paper } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "@/components/TaskCard";
import type { DragEndEvent } from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import TaskModal from "@/components/TaskModal";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import React from "react";

const STATUS_COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
];

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NotePenLoader from "@/components/NotePenLoader";

export default function TaskStatusBoard({ taskId }: { taskId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isValidId = !!taskId && !isNaN(Number(taskId));
  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery<Task, Error>({
    queryKey: ["task", taskId],
    queryFn: () =>
      isValidId ? fetchTask(Number(taskId)) : Promise.reject("Invalid task ID"),
    enabled: Boolean(isValidId),
    staleTime: 1000 * 60 * 5,
  });
  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (updated) => {
      queryClient.setQueryData(["task", String(updated.id)], updated);
      refetch();
    },
  });
  // Delete mutation using shared API helper
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiDeleteTask(id);
      return id;
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  // Local state for edit modal and delete dialog
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Always call hooks, even if task is not ready
  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
  } = useDraggable({ id: String(task?.id ?? "placeholder") });
  const { setNodeRef: setDropRefTodo } = useDroppable({ id: "todo" });
  const { setNodeRef: setDropRefDoing } = useDroppable({ id: "doing" });
  const { setNodeRef: setDropRefDone } = useDroppable({ id: "done" });

  const dropRefs: Record<string, (element: HTMLElement | null) => void> = {
    todo: setDropRefTodo,
    doing: setDropRefDoing,
    done: setDropRefDone,
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!task) return;
    const { active, over } = event;
    if (!over || !active) return;
    const overStatus = over.id as "todo" | "doing" | "done";
    if (task.status !== overStatus) {
      mutation.mutate({ ...task, status: overStatus });
    }
  };

  // Now render error/loading UI
  if (!isValidId) return <Typography color="error">Invalid task ID</Typography>;
  if (isLoading)
    return (
      <Typography component="div">
        <NotePenLoader />
      </Typography>
    );
  if (isError || !task)
    return <Typography color="error">Task not found</Typography>;

  // Handlers for edit/delete
  const handleEdit = () => setEditOpen(true);
  const handleDelete = () => setDeleteDialogOpen(true);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 1 }}>
            {task.title}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/")}
          >
            Back to Dashboard
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {STATUS_COLUMNS.map((col) => (
              <Paper
                key={col.id}
                ref={dropRefs[col.id]}
                sx={{
                  flex: 1,
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 400,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  {col.label}
                </Typography>
                <SortableContext
                  items={task.status === col.id ? [String(task.id)] : []}
                  strategy={verticalListSortingStrategy}
                >
                  {task.status === col.id ? (
                    <Box key={task.id} mb={2} ref={setDragRef}>
                      <TaskCard
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selected={true}
                        dragHandleProps={attributes}
                        listeners={listeners}
                        disableCardClick={true}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        color: "text.secondary",
                        opacity: 0.5,
                        minHeight: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      No tasks
                    </Box>
                  )}
                </SortableContext>
              </Paper>
            ))}
          </DndContext>
        </Box>
        {/* Edit Modal */}
        <TaskModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={async (values) => {
            setLocalError(null);
            try {
              await mutation.mutateAsync({ ...task, ...values });
              setEditOpen(false);
            } catch {
              setLocalError("Failed to update task");
            }
          }}
          task={task}
          isSubmitting={mutation.isPending}
          onDelete={async () => {}}
        />
        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContentText sx={{ px: 3, pt: 1 }}>
            Are you sure you want to delete &quot;{task.title}&quot;?
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
            <Button
              color="error"
              onClick={async () => {
                setLocalError(null);
                try {
                  await deleteMutation.mutateAsync(task.id);
                  setDeleteDialogOpen(false);
                } catch {
                  setLocalError("Failed to delete task");
                }
              }}
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
        {localError && (
          <Alert
            severity="error"
            sx={{ position: "fixed", bottom: 24, left: 24, zIndex: 9999 }}
          >
            {localError}
          </Alert>
        )}
      </Box>
    </DndProvider>
  );
}
