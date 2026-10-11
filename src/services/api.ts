// Small fetch wrapper for the Django API (vri-api). Turns DRF error responses into ApiError.
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached. */
  status: number;
  /** First message per field, e.g. { identifier: "This field is required." } */
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  if (!API_URL) {
    throw new ApiError("The app has no server address. Set EXPO_PUBLIC_API_URL in .env.", 0);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("We couldn't reach the server. Check your connection and try again.", 0);
  } finally {
    clearTimeout(timer);
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, data);
  }
  return data as T;
}

// DRF errors look like {"detail": "..."}, {"non_field_errors": ["..."]} or {"field": ["..."]}.
function toApiError(status: number, data: unknown): ApiError {
  if (status === 429) {
    return new ApiError("Too many attempts. Please wait a minute and try again.", status);
  }
  if (status >= 500 || !data || typeof data !== "object") {
    return new ApiError("Something went wrong on our side. Please try again.", status);
  }

  let message = "";
  const fieldErrors: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const text = Array.isArray(value) ? String(value[0] ?? "") : typeof value === "string" ? value : "";
    if (!text) continue;
    if (key === "detail" || key === "non_field_errors") {
      message = message || text;
    } else {
      fieldErrors[key] = text;
    }
  }
  return new ApiError(message || "Please check your details and try again.", status, fieldErrors);
}
