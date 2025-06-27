import { NextResponse } from "next/server";

// client runn on 3000 port
// server runn on 3001 port
const API_URL = "http://127.0.0.1:3001";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/tasks/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching task ${params.id}:`, error);
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

    const response = await fetch(`${API_URL}/tasks/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating task ${params.id}:`, error);
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
    const response = await fetch(`${API_URL}/tasks/${params.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting task ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
