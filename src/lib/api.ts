export interface Column {
  id: "backlog" | "in_progress" | "review" | "done";
  title: string;
}

export interface SubTask {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
}

export interface Task {
  id: string | number;
  title: string;
  description: string;
  column: "backlog" | "in_progress" | "review" | "done";
  status: "backlog" | "in_progress" | "review" | "done";
  subtasks?: SubTask[]; // optional for backward compatibility
}

// Base URL for API requests - using environment variable with fallback
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Common headers for all requests
const getHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Cache: "no-cache",
  Pragma: "no-cache",
  "X-Requested-With": "XMLHttpRequest",
});

// Helper to build full URL
const getApiUrl = (path: string) => {
  // Remove leading slash from path if present (we'll add it)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${cleanPath}`;
};
// console.log(API_BASE); // Commented out to reduce noise and avoid unused-variable lint
// Helper to handle API errors
const handleApiError = async (response: Response, defaultMessage: string) => {
  if (!response.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Ignore JSON parse errors and use default message
    }
    throw new Error(`${errorMessage} (Status: ${response.status})`);
  }
  return response;
};

// Debug function to log request details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logRequest = <T = unknown>(method: string, url: string, data?: T) => {
  console.groupCollapsed(`API Request: ${method} ${url}`);
  console.log("Method:", method);
  console.log("URL:", url);
  if (data) console.log("Data:", data);
  console.groupEnd();
};

export const fetchColumns = async (): Promise<Column[]> => {
  try {
    const url = getApiUrl(`columns`);
    logRequest("GET", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store", // Prevent caching
    });

    await handleApiError(response, "Failed to fetch columns");

    const data = await response.json();
    logResponse(response, data);
    return data as Column[];
  } catch (error) {
    console.error("Error in fetchColumns:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Debug function to log response details
const logResponse = (response: Response, data?: unknown) => {
  console.groupCollapsed(
    `API Response: ${response.status} ${response.statusText}`
  );
  console.log("Status:", response.status, response.statusText);
  console.log("URL:", response.url);
  if (data) console.log("Data:", data);
  console.groupEnd();
  return data;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const url = getApiUrl(`tasks`);
    logRequest("GET", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store", // Prevent caching
    });

    // Handle API errors
    await handleApiError(response, "Failed to fetch tasks");

    // Parse response data
    const data = (await response.json()) as Task[];
    logResponse(response, data);

    return data;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const url = getApiUrl("tasks");
    logRequest("POST", url, task);

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(task),
      cache: "no-store", // Prevent caching
    });

    // Handle API errors
    await handleApiError(response, "Failed to create task");

    // Parse response data
    const data = (await response.json()) as Task;
    logResponse(response, data);

    return data;
  } catch (error) {
    console.error("Error in createTask:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    const url = getApiUrl(`tasks/${task.id}`);
    logRequest("PUT", url, task);

    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(task),
      cache: "no-store", // Prevent caching
    });

    // Handle API errors
    await handleApiError(response, "Failed to update task");

    // Parse response data
    const data = (await response.json()) as Task;
    logResponse(response, data);

    return data;
  } catch (error) {
    console.error("Error in updateTask:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const fetchTask = async (id: string | number): Promise<Task> => {
  try {
    const url = getApiUrl(`tasks/${String(id)}`);
    logRequest("GET", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });

    await handleApiError(response, `Failed to fetch task ${id}`);

    const data = await response.json();
    logResponse(response, data);
    return data;
  } catch (error) {
    console.error(`Error in fetchTask for id ${id}:`, error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const deleteTask = async (id: string | number): Promise<void> => {
  try {
    const url = getApiUrl(`tasks/${String(id)}`);
    logRequest("DELETE", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      cache: "no-store", // Prevent caching
    });

    // Some servers return 200 OK with the deleted entity, others return 204 No Content.
    // Treat both as success.
    if (![200, 204].includes(response.status)) {
      await handleApiError(response, "Failed to delete task");
    } else {
      try {
        const data =
          response.status === 200 ? await response.json() : { success: true };
        logResponse(response, data);
      } catch {
        // ignore body parse when none
        logResponse(response);
      }
    }
  } catch (error) {
    console.error("Error in deleteTask:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const fetchTasksPaginated = async ({
  column,
  page = 1,
  limit = 5,
  search = "",
}: {
  column: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (column) params.append("column", column);
    if (search) params.append("q", search);
    params.append("_page", String(page));
    params.append("_limit", String(limit));
    const url = getApiUrl(`tasks?${params.toString()}`);
    logRequest("GET", url);
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    await handleApiError(response, "Failed to fetch tasks");
    const data = await response.json();
    const total = Number(response.headers.get("x-total-count") || data.length);
    logResponse(response, data);
    return { data, total };
  } catch (error) {
    console.error("Error in fetchTasksPaginated:", error);
    throw error;
  }
};
