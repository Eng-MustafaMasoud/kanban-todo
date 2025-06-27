import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import columnsReducer from "./columnsSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    columns: columnsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
