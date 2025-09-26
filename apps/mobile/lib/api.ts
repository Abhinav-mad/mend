// apps/mobile/lib/api.ts
import { api } from "../utils/api";

export type SpacePlan = {
  _id?: string;
  userId?: string;
  days?: number;
  startedAt?: string;
  status?: "active" | "paused" | "completed" | "canceled" | "inactive";
};

// --- Space endpoints (match apps/api) ---
export async function getCurrentSpace(): Promise<SpacePlan> {
  const res = await api.get("/space");
  // backend returns { data: plan } or plan — handle both
  const payload = res.data;
  if (payload && payload.data !== undefined) return payload.data;
  return payload;
}

export async function startSpace(days: number) {  
  console.log("Calling API to start space with", days);
  const res = await api.post("/space", { days });
  const payload = res.data;
  console.log("API response:", res.data);
  return payload.data ?? payload;
}

export async function pauseSpace() {
  const res = await api.post("/space/pause");
  const payload = res.data;
  return payload.data ?? payload;
}

export async function adjustSpace(days: number) {
    if (!Number.isInteger(days) || days <= 0) {
    throw new Error("Invalid days");
  }
  const res = await api.post("/space/adjust",{days});
  const payload = res.data;
  return payload.data ?? payload;
}

// --- Check-in endpoints ---
export type CheckIn = { _id?: string; userId?: string; mood?: string; note?: string; createdAt?: string; date?: string; };

export async function getCheckIns(startedAt?: string): Promise<CheckIn[]> {
  const res = await api.get("/checkin", {
    params: startedAt ? { startedAt } : {},
  });
  const payload = res.data;
  return payload.data ?? payload ?? [];
}

export async function addCheckIn(note: string) {
  const res = await api.post("/checkin", { note });
  const payload = res.data;
  return payload.data ?? payload;
}

export async function deleteCheckIn(id: string) {
  const res = await api.delete(`/checkin/${id}`);
  const payload = res.data;
  return payload.data ?? payload;
}

