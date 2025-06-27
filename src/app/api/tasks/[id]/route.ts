import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define types for the database
interface Task {
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

interface Database {
  tasks: Task[];
  columns?: Array<{
    id: string;
    title: string;
  }>;
}

// Path to the JSON database file
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper function to read the database
const readDB = (): Database => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    // Return default structure if database file doesn't exist
    return { tasks: [] };
  }
};

// Helper function to write to the database
const writeDB = (data: Database): boolean => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to database:", error);
    return false;
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = readDB();
    const task = db.tasks.find((t: Task) => t.id.toString() === params.id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = readDB();

    const taskIndex = db.tasks.findIndex(
      (t: Task) => t.id.toString() === params.id
    );

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task
    db.tasks[taskIndex] = {
      ...db.tasks[taskIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    if (writeDB(db)) {
      return NextResponse.json(db.tasks[taskIndex]);
    } else {
      throw new Error("Failed to write to database");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = readDB();

    const taskIndex = db.tasks.findIndex(
      (t: Task) => t.id.toString() === params.id
    );

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Remove the task
    db.tasks.splice(taskIndex, 1);

    if (writeDB(db)) {
      return NextResponse.json({ message: "Task deleted successfully" });
    } else {
      throw new Error("Failed to write to database");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
