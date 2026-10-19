// Small fetch wrapper for the Django API (vri-api). Turns DRF error responses into ApiError.
import { getAccessToken } from "./session";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 15000;
// File uploads are slower than JSON calls, especially on mobile data.
const UPLOAD_TIMEOUT_MS = 60000;

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached. */
  status: number;
  /** First message per field, e.g. { identifier: "This field is required." } */
  fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = {
  method: "GET" | "POST";
  /** JSON object or FormData. Do not set Content-Type for FormData: fetch adds the multipart boundary. */
  body?: unknown;
  /** Send the stored access token as a Bearer header. */
  auth?: boolean;
  timeoutMs?: number;
};

async function request<T>(
  path: string,
  { method, body, auth, timeoutMs = TIMEOUT_MS }: RequestOptions,
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "The app has no server address. Set EXPO_PUBLIC_API_URL in .env.",
      0,
    );
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth) {
    const token = await getAccessToken();
    if (!token) {
      throw new ApiError("Please sign in again.", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      "We couldn't reach the server. Check your connection and try again.",
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, data);
  }
  return data as T;
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body });
}

/** Signed-in POST with a JSON body (e.g. email verification). */
export function postAuthedJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body, auth: true });
}

/** Signed-in GET. */
export function getJson<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET", auth: true });
}

/** Signed-in multipart upload (e.g. a certification document). */
export function postForm<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: form,
    auth: true,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
}

// DRF errors look like {"detail": "..."}, {"non_field_errors": ["..."]} or {"field": ["..."]}.
function toApiError(status: number, data: unknown): ApiError {
  if (status === 429) {
    return new ApiError(
      "Too many attempts. Please wait a minute and try again.",
      status,
    );
  }
  if (status === 401) {
    return new ApiError(
      "Your session has expired. Please sign in again.",
      status,
    );
  }
  if (status === 413) {
    return new ApiError(
      "That file is too large. Choose a smaller file.",
      status,
    );
  }
  if (status >= 500 || !data || typeof data !== "object") {
    return new ApiError(
      "Something went wrong on our side. Please try again.",
      status,
    );
  }

  let message = "";
  const fieldErrors: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const text = Array.isArray(value)
      ? String(value[0] ?? "")
      : typeof value === "string"
        ? value
        : "";
    if (!text) continue;
    if (key === "detail" || key === "non_field_errors") {
      message = message || text;
    } else {
      fieldErrors[key] = text;
    }
  }
  return new ApiError(
    message || "Please check your details and try again.",
    status,
    fieldErrors,
  );
}
