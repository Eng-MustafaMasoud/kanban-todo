"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  DialogContentText,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { Task } from "@/lib/api";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  column: Yup.string()
    .oneOf(["backlog", "in_progress", "review", "done"])
    .required("Column is required"),
});

// Separate validation schema for editing (without column requirement)
const editValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Task, "id">, taskId?: string) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  task?: Task | null;
  isSubmitting: boolean;
}

const columnLabels = {
  backlog: "Backlog",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  task,
  isSubmitting,
}: TaskModalProps) {
  const [mounted, setMounted] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik<{
    title: string;
    description: string;
    column: "backlog" | "in_progress" | "review" | "done";
  }>({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      column:
        (task?.column as "backlog" | "in_progress" | "review" | "done") ||
        "backlog",
    },
    validationSchema: task?.id ? editValidationSchema : validationSchema,
    enableReinitialize: false, // Disable to prevent re-renders on every keystroke
    onSubmit: async (values) => {
      try {
        setError("");

        // For edit mode, preserve the existing column if not provided
        // For add mode, use the selected column
        let submitValues: Omit<Task, "id">;

        if (task?.id) {
          // Edit mode
          submitValues = {
            title: values.title,
            description: values.description,
            column: values.column || task.column,
            status: task.status, // Keep existing status
          };
        } else {
          // Add mode - use column as status
          submitValues = {
            title: values.title,
            description: values.description,
            column: values.column,
            status: values.column, // Use column as status
          };
        }

        await onSubmit(submitValues, task?.id ? String(task.id) : undefined);
      } catch (err) {
        console.error("Form submission error:", err);
        setError(err instanceof Error ? err.message : "Failed to save task");
      }
    },
  });

  // Ensure this component only renders on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update form values when task changes (only when modal opens)
  useEffect(() => {
    if (open && task) {
      formik.setValues({
        title: task.title || "",
        description: task.description || "",
        column:
          (task.column as "backlog" | "in_progress" | "review" | "done") ||
          "backlog",
      });
    } else if (open && !task) {
      // Reset form for new task
      formik.resetForm();
    }
  }, [open, task?.id]); // Only depend on open state and task ID

  const handleDelete = useCallback(async () => {
    if (!task?.id || !onDelete) return;

    try {
      setError("");
      await onDelete(String(task.id));
      setDeleteConfirmOpen(false);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
    }
  }, [task?.id, onDelete, onClose]);

  // Don't render anything on the server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const isEditMode = !!task?.id;

  return (
    <>
      {/* Main Task Form Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: { xs: "95%", sm: "100%" },
            maxWidth: { xs: "95%", sm: 600 },
            margin: { xs: 2, sm: "auto" },
            borderRadius: { xs: 2, sm: 3 },
          },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {isEditMode ? "Edit Task" : "Add New Task"}
              <IconButton
                edge="end"
                onClick={onClose}
                disabled={isSubmitting}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              disabled={isSubmitting}
            />

            <TextField
              fullWidth
              margin="normal"
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              rows={4}
              disabled={isSubmitting}
            />

            {!isEditMode && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="column-label">Column</InputLabel>
                <Select
                  labelId="column-label"
                  id="column"
                  name="column"
                  value={formik.values.column}
                  label="Column"
                  onChange={(e) =>
                    formik.setFieldValue("column", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  {Object.entries(columnLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isEditMode && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="column-label">Column</InputLabel>
                <Select
                  labelId="column-label"
                  id="column"
                  name="column"
                  value={formik.values.column}
                  label="Column"
                  onChange={(e) =>
                    formik.setFieldValue("column", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  {Object.entries(columnLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Box>
              {isEditMode && onDelete && (
                <Button
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
            </Box>
            <Box>
              <Button onClick={onClose} disabled={isSubmitting} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  "Update Task"
                ) : (
                  "Add Task"
                )}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !isSubmitting && setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <Delete />
            }
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
