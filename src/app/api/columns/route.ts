import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define types for the database
interface Column {
  id: "backlog" | "in_progress" | "review" | "done";
  title: string;
}

interface Database {
  tasks: Array<{
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
  }>;
  columns?: Column[];
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

export async function GET() {
  try {
    const db = readDB();

    // If columns exist in the database, return them
    if (db.columns && db.columns.length > 0) {
      return NextResponse.json(db.columns);
    }

    // Otherwise, return default columns
    const defaultColumns: Column[] = [
      { id: "backlog", title: "Backlog" },
      { id: "in_progress", title: "In Progress" },
      { id: "review", title: "Review" },
      { id: "done", title: "Done" },
    ];

    return NextResponse.json(defaultColumns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json(
      { error: "Failed to fetch columns" },
      { status: 500 }
    );
  }
}
