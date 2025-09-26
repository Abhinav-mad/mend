// apps/mobile/utils/userId.ts
import * as SecureStore from "expo-secure-store";

const KEY = "mend_user_id";
let _userId: string | null = null;

export async function initUserId(): Promise<string> {
  if (_userId) return _userId;
  try {
    const existing = await SecureStore.getItemAsync(KEY);
    if (existing) {
      _userId = existing;
      return existing;
    }
    // simple unique id; good enough for anonymous identity
    const newId = `mobile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
    await SecureStore.setItemAsync(KEY, newId);
    _userId = newId;
    return newId;
  } catch (e) {
    // fallback
    const fallback = `mobile-fallback-${Date.now()}`;
    _userId = fallback;
    return fallback;
  }
}

export function getUserId(): string {
  return _userId ?? "";
}
