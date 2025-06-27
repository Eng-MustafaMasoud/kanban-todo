// TaskDetails.tsx
// Feature component for displaying, editing, and deleting a single task.
// Handles fetching from Redux, dispatching fetchTasks if needed, and uses TaskModal for editing.
// This component is intended to be used by the details page route.

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { editTask, deleteTask } from "@/store/tasksSlice";
import TaskModal from "@/components/TaskModal";
import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "@/lib/api";
import {
  Box,
  Typography,
  Button,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import NotePenLoader from "@/components/NotePenLoader";

// Status options for the task status dropdown
const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
];

/**
 * TaskDetails - Displays and manages a single task's details.
 * - Fetches tasks from Redux (dispatches fetchTasks if needed)
 * - Allows editing and deleting the task
 * - Uses TaskModal for editing
 * - Handles loading and error states
 */
export default function TaskDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  // Try to get the task from Redux cache first
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const cachedTask = tasks.find((t) => String(t.id) === String(id));
  // React Query for fetching the task (with cache)
  const {
    data: task,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(Number(id)),
    enabled: !cachedTask && typeof id !== "undefined",
    initialData: cachedTask,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Local state for modal/dialog visibility and error handling
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography>
          {" "}
          <NotePenLoader />
        </Typography>
      </Box>
    );
  }
  if (isError || !task) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Task not found</Typography>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>
          Back to Board
        </Button>
        {error && <Alert severity="error">{(error as Error).message}</Alert>}
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        {task.title}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {task.description || "No description provided."}
      </Typography>
      {localError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <TaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={async (values) => {
          setLocalError(null);
          try {
            await dispatch(editTask({ ...task, ...values }));
            setEditOpen(false);
            refetch();
          } catch {
            setLocalError("Failed to update task");
          }
        }}
        task={task}
        isSubmitting={false}
        onDelete={async () => {
          setEditOpen(false);
          setDeleteDialogOpen(true);
        }}
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
                await dispatch(deleteTask(task.id));
                setDeleteDialogOpen(false);
                router.push("/");
              } catch {
                setLocalError("Failed to delete task");
              }
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
