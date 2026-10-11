import { postJson } from "./api";
import { startSession } from "./session";

// Matches UserSerializer in vri-api (apps/accounts/serializers.py).
export type UserRole = "deaf_hoh" | "interpreter" | "institution" | "admin";

export type AuthUser = {
  id: number;
  full_name: string;
  phone_number: string;
  email: string | null;
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
export async function login(identifier: string, password: string): Promise<AuthUser> {
  const { access, refresh, user } = await postJson<LoginResponse>("/api/v1/auth/login/", {
    identifier: identifier.trim(),
    password,
  });
  await startSession(access, refresh, user);
  return user;
}
