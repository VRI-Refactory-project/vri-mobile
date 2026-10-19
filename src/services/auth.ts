import { postAuthedJson, postJson } from "./api";
import { startSession, updateCurrentUser } from "./session";

// Matches UserSerializer in vri-api (apps/accounts/serializers.py).
export type UserRole = "deaf_hoh" | "interpreter" | "institution" | "admin";

export type AuthUser = {
  id: number;
  full_name: string;
  phone_number: string;
  email: string | null;
  /** False until the person confirms the code sent to their email. Missing when the API does not say. */
  email_verified?: boolean;
  role: UserRole;
  must_change_password: boolean;
  date_joined: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

/**
 * POST /api/v1/auth/login/. `identifier` is a phone number (0772123456 or +256772123456) or an email.
 * Throws ApiError on failure. On success the tokens are stored and the user is returned.
 */
export async function login(
  identifier: string,
  password: string,
): Promise<AuthUser> {
  const { access, refresh, user } = await postJson<LoginResponse>(
    "/api/v1/auth/login/",
    {
      identifier: identifier.trim(),
      password,
    },
  );
  await startSession(access, refresh, user);
  return user;
}

/** True when this person still has to confirm their email (every role except admin). */
export function needsEmailVerification(user: AuthUser): boolean {
  return user.role !== "admin" && !!user.email && user.email_verified === false;
}

/** Email verification: send the signed-in user a new 6-digit code. */
export function resendEmailCode(): Promise<{ detail: string }> {
  return postAuthedJson<{ detail: string }>("/api/v1/auth/email/resend/", {});
}

/** Email verification: check the code from the email. Updates the signed-in user and returns it. */
export async function confirmEmailCode(code: string): Promise<AuthUser> {
  const user = await postAuthedJson<AuthUser>("/api/v1/auth/email/verify/", {
    code: code.trim(),
  });
  updateCurrentUser(user);
  return user;
}
