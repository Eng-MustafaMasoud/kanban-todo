import { NextResponse } from "next/server";
import { readDB, writeDB, Task } from "@/lib/database";

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

export async function GET(request: Request) {
  try {
    const db = readDB();
    const tasks = db.tasks || [];

    // Handle query parameters for filtering and pagination
    const url = new URL(request.url);
    const column = url.searchParams.get("column");
    const search = url.searchParams.get("q") || url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("_page") || "1");
    const limit = parseInt(url.searchParams.get("_limit") || "10");

    let filteredTasks = tasks;

    if (column) {
      filteredTasks = filteredTasks.filter(
        (task: Task) => task.column === column
      );
    }

    if (search) {
      filteredTasks = filteredTasks.filter(
        (task: Task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Handle pagination
    const total = filteredTasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // If pagination parameters are present, return paginated response
    if (url.searchParams.has("_page") || url.searchParams.has("_limit")) {
      const response = NextResponse.json(paginatedTasks);
      response.headers.set("x-total-count", total.toString());
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    // Otherwise return all filtered tasks
    const response = NextResponse.json(filteredTasks);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDB();

    // Generate a new ID
    const newId = Date.now().toString();
    const newTask: Task = {
      ...body,
      id: newId,
    };

    // Add to database
    db.tasks = db.tasks || [];
    db.tasks.push(newTask);

    if (writeDB(db)) {
      const response = NextResponse.json(newTask, { status: 201 });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    } else {
      throw new Error("Failed to write to database");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
