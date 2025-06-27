import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "@/lib/api";
import * as api from "@/lib/api";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await api.fetchTasks();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: Omit<Task, "id">) => {
    return await api.createTask(task);
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (task: Task) => {
    return await api.updateTask(task);
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string | number) => {
    await api.deleteTask(id);
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<string | number>) => {
          state.tasks = state.tasks.filter(
            (t) => String(t.id) !== String(action.payload)
          );
        }
      );
  },
});

export default tasksSlice.reducer;
