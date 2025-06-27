import { NextResponse } from "next/server";
import { readDB, Column } from "@/lib/database";

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
