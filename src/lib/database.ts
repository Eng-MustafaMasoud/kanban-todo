import fs from "fs";
import path from "path";

// Define types for the database
export interface Task {
  id: string | number;
  title: string;
  description: string;
  column: "backlog" | "in_progress" | "review" | "done";
  status: "backlog" | "in_progress" | "review" | "done";
  subtasks?: Array<{
    id: number;
    title: string;
    status: "todo" | "doing" | "done";
  }>;
}

export interface Column {
  id: "backlog" | "in_progress" | "review" | "done";
  title: string;
}

export interface Database {
  tasks: Task[];
  columns?: Column[];
}

// Path to the JSON database file
const DB_PATH = path.join(process.cwd(), "db.json");

// In-memory storage for production (Netlify doesn't allow file writes)
let inMemoryDB: Database | null = null;

// Default data for production
const getDefaultData = (): Database => ({
  tasks: [
    {
      id: "1",
      title: "Welcome to Kanban Board",
      description:
        "This is a sample task. You can drag and drop tasks between columns, edit them, or create new ones!",
      column: "backlog",
      status: "backlog",
    },
    {
      id: "2",
      title: "Create Your First Task",
      description: "Click the + button in any column to add a new task",
      column: "in_progress",
      status: "in_progress",
    },
    {
      id: "3",
      title: "Try Drag and Drop",
      description: "Drag tasks between columns to change their status",
      column: "review",
      status: "review",
    },
  ],
  columns: [
    { id: "backlog", title: "Backlog" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ],
});

// Helper function to read the database
export const readDB = (): Database => {
  // In production, use in-memory storage
  if (process.env.NODE_ENV === "production") {
    if (!inMemoryDB) {
      inMemoryDB = getDefaultData();
    }
    return inMemoryDB;
  }

  // In development, read from file
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    // Return default structure if database file doesn't exist
    return getDefaultData();
  }
};

// Helper function to write to the database
export const writeDB = (data: Database): boolean => {
  // In production, update in-memory storage
  if (process.env.NODE_ENV === "production") {
    inMemoryDB = data;
    return true;
  }

  // In development, write to file
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to database:", error);
    return false;
  }
};

// Helper function to reset the database to default state
export const resetDB = (): boolean => {
  const defaultData = getDefaultData();
  return writeDB(defaultData);
};
