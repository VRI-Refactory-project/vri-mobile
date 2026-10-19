import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { AuthUser } from "./auth";

const ACCESS_KEY = "vri.access_token";
const REFRESH_KEY = "vri.refresh_token";

// Native devices use SecureStore.
// Web tokens stay in memory and are lost when the page reloads.
const isWeb = Platform.OS === "web";
const webMemory = new Map<string, string>();

// Current user exists only in memory for this app session.
let currentUser: AuthUser | null = null;

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    webMemory.set(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return webMemory.get(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    webMemory.delete(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

/**
 * Start a signed-in session after authentication succeeds.
 */
export async function startSession(
  access: string,
  refresh: string,
  user: AuthUser,
): Promise<void> {
  // Store both tokens before marking the user as signed in.
  await setItem(ACCESS_KEY, access);
  await setItem(REFRESH_KEY, refresh);

  currentUser = user;
}

/**
 * End the current session and clear stored tokens.
 */
export async function endSession(): Promise<void> {
  currentUser = null;

  await Promise.all([deleteItem(ACCESS_KEY), deleteItem(REFRESH_KEY)]);
}

/**
 * Replace the current in-memory user after an API update.
 */
export function updateCurrentUser(user: AuthUser): void {
  currentUser = user;
}

/**
 * Return the current in-memory user, or null if unavailable.
 */
export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

/**
 * Return the stored access token.
 */
export function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_KEY);
}

/**
 * Return the stored refresh token.
 * Token refresh is not implemented by this function.
 */
export function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_KEY);
}
