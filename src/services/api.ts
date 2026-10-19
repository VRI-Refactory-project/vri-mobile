// Small fetch wrapper for the Django API (vri-api).
// Converts DRF error responses into ApiError.

import { getAccessToken } from "./session";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const TIMEOUT_MS = 15000;
const UPLOAD_TIMEOUT_MS = 60000;

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached. */
  status: number;

  /** First useful validation message per field. */
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

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions = {
  method: HttpMethod;
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
};

async function request<T>(
  path: string,
  { method, body, auth = false, timeoutMs = TIMEOUT_MS }: RequestOptions,
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "The app has no server address. Set EXPO_PUBLIC_API_URL in .env.",
      0,
    );
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  let payload: BodyInit | undefined;

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    // Do not set Content-Type manually for FormData.
    // fetch must add the multipart boundary.
    payload = body as unknown as BodyInit;
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

  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    });
  } catch {
    if (timedOut) {
      throw new ApiError("The request took too long. Please try again.", 0);
    }

    throw new ApiError(
      "We couldn't reach the server. Check your connection and try again.",
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  // Some endpoints, such as DELETE, may return HTTP 204 with no body.
  let data: unknown = null;

  if (response.status !== 204) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    throw toApiError(response.status, data);
  }

  return data as T;
}

/** Public POST with a JSON body. */
export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body,
  });
}

/** Signed-in POST with a JSON body. */
export function postAuthedJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body,
    auth: true,
  });
}

/** Signed-in GET. */
export function getJson<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: "GET",
    auth: true,
  });
}

/** Signed-in PATCH. Use only where the backend supports PATCH. */
export function patchAuthedJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body,
    auth: true,
  });
}

/** Signed-in PUT. Use only where the backend supports PUT. */
export function putAuthedJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body,
    auth: true,
  });
}

/** Signed-in DELETE. Use only where the backend supports DELETE. */
export function deleteAuthed<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: "DELETE",
    auth: true,
  });
}

/** Signed-in multipart upload. */
export function postForm<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: form,
    auth: true,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
}

function firstMessage(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstMessage(item);

      if (message) {
        return message;
      }
    }
  }

  if (value && typeof value === "object") {
    const values = Object.values(value as Record<string, unknown>);

    for (const item of values) {
      const message = firstMessage(item);

      if (message) {
        return message;
      }
    }
  }

  return "";
}

function toApiError(status: number, data: unknown): ApiError {
  if (status === 401) {
    return new ApiError(
      "Your session has expired. Please sign in again.",
      status,
    );
  }

  if (status === 403) {
    return new ApiError(
      "You don't have permission to perform this action.",
      status,
    );
  }

  if (status === 404) {
    return new ApiError("The requested resource could not be found.", status);
  }

  if (status === 413) {
    return new ApiError(
      "That file is too large. Choose a smaller file.",
      status,
    );
  }

  if (status === 429) {
    return new ApiError(
      "Too many attempts. Please wait a minute and try again.",
      status,
    );
  }

  if (status >= 500) {
    return new ApiError(
      "Something went wrong on our side. Please try again.",
      status,
    );
  }

  if (!data || typeof data !== "object") {
    return new ApiError(
      "The request could not be completed. Please try again.",
      status,
    );
  }

  const fieldErrors: Record<string, string> = {};
  let message = "";

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const text = firstMessage(value);

    if (!text) {
      continue;
    }

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
