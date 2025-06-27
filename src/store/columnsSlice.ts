import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Column } from "@/lib/api";
import * as api from "@/lib/api";

interface ColumnsState {
  columns: Column[];
  loading: boolean;
  error: string | null;
}

const initialState: ColumnsState = {
  columns: [],
  loading: false,
  error: null,
};

export const fetchColumns = createAsyncThunk(
  "columns/fetchColumns",
  async () => {
    return await api.fetchColumns();
  }
);

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchColumns.fulfilled,
        (state, action: PayloadAction<Column[]>) => {
          state.loading = false;
          state.columns = action.payload;
        }
      )
      .addCase(fetchColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch columns";
      });
  },
});

export default columnsSlice.reducer;
