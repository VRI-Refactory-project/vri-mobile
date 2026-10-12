import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { AuthUser } from "./auth";

const ACCESS_KEY = "vri.access_token";
const REFRESH_KEY = "vri.refresh_token";

// SecureStore has no web implementation, so on web the tokens only live in memory for this tab.
const isWeb = Platform.OS === "web";
const webMemory = new Map<string, string>();

// Signed-in user for this app session. Not persisted: restoring a session on launch comes later.
let currentUser: AuthUser | null = null;

async function setItem(key: string, value: string) {
  if (isWeb) {
    webMemory.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  return isWeb ? (webMemory.get(key) ?? null) : SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) {
    webMemory.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function startSession(access: string, refresh: string, user: AuthUser) {
  await setItem(ACCESS_KEY, access);
  await setItem(REFRESH_KEY, refresh);
  currentUser = user;
}

export async function endSession() {
  currentUser = null;
  await deleteItem(ACCESS_KEY);
  await deleteItem(REFRESH_KEY);
}

export function getCurrentUser() {
  return currentUser;
}

export function getAccessToken() {
  return getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return getItem(REFRESH_KEY);
}
