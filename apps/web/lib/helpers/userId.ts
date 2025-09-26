export function getUserId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "mend_user_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    if (crypto && "randomUUID" in crypto) {
      id = crypto.randomUUID();
    } else {
      // simple fallback
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    localStorage.setItem(KEY, id);
  }
  return id;
}
