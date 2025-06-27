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

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET() {
  try {
    const db = readDB();

    // If columns exist in the database, return them
    if (db.columns && db.columns.length > 0) {
      const response = NextResponse.json(db.columns);
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    // Otherwise, return default columns
    const defaultColumns: Column[] = [
      { id: "backlog", title: "Backlog" },
      { id: "in_progress", title: "In Progress" },
      { id: "review", title: "Review" },
      { id: "done", title: "Done" },
    ];

    const response = NextResponse.json(defaultColumns);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json(
      { error: "Failed to fetch columns" },
      { status: 500 }
    );
  }
}
