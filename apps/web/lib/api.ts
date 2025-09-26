import { ISpacePlan, ICreateSpaceResponse, IFetchSpacesResponse } from "./types/space";
import {  ICreateCheckinRequest, ICheckin } from "./types/checkin";
import { getUserId } from "./helpers/userId";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";



// export type SpacePlan = {
//   _id?: string;
//   userId?: string;
//   targetDays: number;
//   startedAt: string;
//   status: "active" | "paused" | "completed" | "inactive";
//   daysComplete?: number;
// };

function authHeaders() {
  const userId = getUserId();
  return {
    "Content-Type": "application/json",
    "X-User-Id": userId
  };
}

export async function startSpace(days: number): Promise<ICreateSpaceResponse> {
  const res = await fetch(`${API_URL}/space`, {
    method: "POST",
    headers: authHeaders() ,
    body: JSON.stringify({ days })
  });
  if (!res.ok) throw new Error("Failed to start space");
  return res.json();
}

export async function getSpaces(): Promise<IFetchSpacesResponse> {
  const res = await fetch(`${API_URL}/space`,{ headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch spaces");
  const data = await res.json();
  console.log("response data", data);
  return data;
}

// Pause current space
export async function pauseSpace() {
  const res = await fetch(`${API_URL}/space/pause`, {  //todo
    method: "POST",
    headers: authHeaders() 
  });
  if (!res.ok) throw new Error("Failed to pause space");
  return res.json();
}

export async function adjustSpace(days: number) {
  const res = await fetch(`${API_URL}/space/adjust`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ days }),
  });

  if (!res.ok) {
    // try to parse structured body
    const body = await res.json().catch(() => null);
    const err: any = new Error(body?.message ?? "Failed to adjust goal");
    err.response = { data: body };
    throw err;
  }

  return res.json();
}

export async function createCheckIn(data: ICreateCheckinRequest): Promise<ICheckin> {
  const res = await fetch(`${API_URL}/checkin`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save check-in");
  return res.json();
}

export async function fetchCheckIns(startedAt?: string): Promise<ICheckin[]> {
  const url = new URL(`${API_URL}/checkin`);
  if (startedAt) url.searchParams.set("startedAt", startedAt);
  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch check-ins");
  return res.json();
}

export async function deleteCheckIn(id?: string): Promise<ICheckin[]> {
 const res = await fetch(`${API_URL}/checkin`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify(id),
  });

  if (!res.ok) throw new Error("Failed to delete check-in");
  return res.json();
}

export function computeProgress(plan: ISpacePlan | { status: "inactive" }) {
  if (!plan || plan.status === "inactive") return { days: 0, pct: 0 };
  const p = plan as ISpacePlan;
  const start = new Date(p.startedAt).getTime();
  const now = Date.now();
  const elapsedDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  const pct = Math.min(100, (elapsedDays / (p.days || 1)) * 100);
  return { days: Math.min(elapsedDays, p.days), pct };
}
