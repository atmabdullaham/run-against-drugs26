// Lightweight fetch-based API client (no external axios needed)
// All requests use relative paths so they work behind the gateway.

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
    this.name = "ApiError";
  }
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });
  } catch (netErr) {
    throw new ApiError(
      "Unable to connect to the server. Please check your internet connection and try again.",
      0
    );
  }

  let data: any = null;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      // If response is a short plain text message (not HTML markup)
      if (text && text.trim().length > 0 && text.length < 200 && !text.includes("<")) {
        data = { error: text.trim() };
      }
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const errData = data as { error?: string; fields?: Record<string, string> } | null;
    let fallbackMsg = "Something went wrong. Please try again.";

    if (res.status === 404) {
      fallbackMsg = "The requested service endpoint was not found. Please refresh and try again.";
    } else if (res.status === 409) {
      fallbackMsg = errData?.error || "This record already exists in our system.";
    } else if (res.status === 413) {
      fallbackMsg = "The submitted information is too large. Please reduce file or text size.";
    } else if (res.status === 429) {
      fallbackMsg = "Too many requests. Please wait a moment and try again.";
    } else if (res.status >= 500) {
      fallbackMsg =
        errData?.error ||
        "The server is temporarily busy or undergoing maintenance. Please try again in a few moments.";
    }

    throw new ApiError(
      errData?.error || fallbackMsg,
      res.status,
      errData?.fields
    );
  }

  if (data && typeof data === "object" && "success" in data && data.success === false) {
    throw new ApiError(
      data.error || "Request failed. Please try again.",
      res.status,
      data.fields
    );
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }),
};

