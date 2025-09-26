// apps/mobile/lib/progress.ts
import { SpacePlan } from "./api";

export function computeProgress(plan: SpacePlan | { status: "inactive" } | null) {
  if (!plan || (plan as any).status === "inactive"){
    return { days: 0, pct: 0 };
  }
  const p = plan as SpacePlan;
  const start = new Date(p.startedAt || "").getTime();
  if (!start || !p.days) return { days: 0, pct: 0 };
  const now = Date.now();
  const elapsedDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  const pct = Math.min(100, (elapsedDays / p.days) * 100);
  return { days: Math.min(elapsedDays, p.days), pct };
}
