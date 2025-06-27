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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const task = db.tasks.find((t: Task) => t.id.toString() === id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const response = NextResponse.json(task);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDB();

    const taskIndex = db.tasks.findIndex((t: Task) => t.id.toString() === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task
    db.tasks[taskIndex] = {
      ...db.tasks[taskIndex],
      ...body,
      id: id, // Ensure ID doesn't change
    };

    if (writeDB(db)) {
      const response = NextResponse.json(db.tasks[taskIndex]);
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const taskIndex = db.tasks.findIndex((t: Task) => t.id.toString() === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Remove the task
    db.tasks.splice(taskIndex, 1);

    if (writeDB(db)) {
      const response = NextResponse.json({
        message: "Task deleted successfully",
      });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
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
