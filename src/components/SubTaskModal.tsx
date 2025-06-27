"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { SubTask } from "@/lib/api";

interface SubTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<SubTask, "id">, subTaskId?: number) => Promise<void>;
  subTask?: SubTask;
  isSubmitting: boolean;
  onDelete: (id: number) => Promise<void>;
}

export default function SubTaskModal({
  open,
  onClose,
  onSubmit,
  subTask,
  isSubmitting,
  onDelete,
}: SubTaskModalProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (subTask) {
      setTitle(subTask.title);
      setStatus(subTask.status);
    } else {
      setTitle("");
      setStatus("todo");
    }
    setErrors({});
  }, [subTask, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await onSubmit(
        {
          title: title.trim(),
          status,
        },
        subTask?.id
      );
      onClose();
    } catch (error) {
      console.error("Error submitting subtask:", error);
    }
  };

  const handleDelete = async () => {
    if (!subTask) return;

    try {
      await onDelete(subTask.id);
      onClose();
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const isEditing = !!subTask;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "95%", sm: "100%" },
          maxWidth: { xs: "95%", sm: 500 },
          margin: { xs: 2, sm: "auto" },
          borderRadius: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="span">
          {isEditing ? "Edit Subtask" : "Add New Subtask"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Subtask Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              autoFocus
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
            />
            {/* Optionally, you can add a select for status if you want to allow changing status here */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            {isEditing && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={isSubmitting}
                sx={{ mr: "auto" }}
              >
                Delete
              </Button>
            )}
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}
