// app/(whatever)/gentle-space/page.tsx  (or the exact file you used)
// keep 'use client' at top if this is a client component
"use client";

import React, { useEffect, useState } from "react";
import { startSpace, computeProgress, getSpaces, pauseSpace, adjustSpace, fetchCheckIns } from "../../../lib/api";
import { ISpacePlan } from "@/lib/types/space";

const PRESETS = [21, 45, 90];

export default function GentleSpacePage() {
  const [plan, setPlan] = useState<ISpacePlan | { status: "inactive" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number>(21);
  const [error, setError] = useState<string | null>(null);

  const [showPause, setShowPause] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustMessage, setAdjustMessage] = useState<string | null>(null);

  const [showCheckins, setShowCheckins] = useState(false);
  const [checkinsLoading, setCheckinsLoading] = useState(false);
  const [checkins, setCheckins] = useState<any[]>([]);

  async function refresh() {
    try {
      setLoading(true);
      const response = await getSpaces();
      const planData = response?.data ?? { status: "inactive" };
      setPlan(planData);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load space");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function begin(days: number) {
    try {
      setLoading(true);
      const res = await startSpace(days);
      // startSpace returns whatever your backend returns; earlier you used { data } shape
      // handle both shapes
      const newPlan = res?.data ?? res;
      setPlan(newPlan);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to start space");
    } finally {
      setLoading(false);
    }
  }

  async function pause() {
    try {
      setLoading(true);
      const res = await pauseSpace();
      const newPlan = res?.data ?? res;
      setPlan(newPlan);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to pause");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjust(days: number) {
    try {
      setAdjusting(true);
      await adjustSpace(days);
      // refetch current plan
      await refresh();
      setShowAdjust(false);
      setAdjustMessage(`Goal updated to ${days} days`);
      setTimeout(() => setAdjustMessage(null), 3000);
    } catch (err: any) {
      // backend returns code NEW_GOAL_BELOW_PROGRESS (we attach in lib/api)
      if (err?.response?.data?.code === "NEW_GOAL_BELOW_PROGRESS") {
        setError(err.response.data.message);
      } else {
        setError(err?.message ?? "Failed to adjust goal");
      }
    } finally {
      setAdjusting(false);
    }
  }

  async function toggleCheckins() {
    if (!plan || (plan as any).status === "inactive") {
      setShowCheckins((s) => !s);
      return;
    }

    if (!showCheckins) {
      // fetch checkins from plan.startedAt -> today
      try {
        setCheckinsLoading(true);
        const startedAt = (plan as any).startedAt;
        const res = await fetchCheckIns(startedAt);
        const items = res; // backend may return { data } shape
        setCheckins(items ?? []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to fetch check-ins");
      } finally {
        setCheckinsLoading(false);
        setShowCheckins(true);
      }
    } else {
      setShowCheckins(false);
    }
  }

  const prog = plan ? computeProgress(plan as any) : { pct: 0, days: 0 };
  const active = plan && (plan as any).status === "active";

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <header>
        <h2 className="text-3xl font-bold">Your Gentle Space</h2>
        <p className="text-white/80"> opt-in, pause for clarity. Not silent treatment—self-care.</p>
      </header>

      <div className="card p-4">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            {error && <p className="text-red-300">{error}</p>}

            <div className="space-y-2">
              <p className="text-white/80">
                Status: <span className="font-semibold">{(plan as any)?.status ?? "inactive"}</span>
              </p>
              {active && (
                <p className="text-white/70">
                  Started: {new Date((plan as ISpacePlan).startedAt).toLocaleDateString()} · Goal: {(plan as any).days} days
                </p>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                <div
                  className="h-4 bg-love-rose rounded-full transition-all"
                  style={{ width: `${prog.pct}%` }}
                />
              </div>
              <p className="text-white/70">
                {Math.round(prog.pct)}% · Day {prog.days} / {(plan as any)?.days ?? selected}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-white/80 mb-2">Pick a soft goal:</p>
              <div className="flex gap-2 flex-wrap">
                {PRESETS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelected(d)}
                    className={`btn ${selected === d ? "btn-primary" : "btn-ghost"}`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {!active ? (
                <button onClick={() => begin(selected)} className="btn btn-primary">
                  Begin {selected}-Day Space
                </button>
              ) : (
                <>
                  <button onClick={() => setShowPause(true)} className="btn btn-ghost">
                    Pause Space
                  </button>
                  <button onClick={() => setShowAdjust(true)} className="btn btn-primary">
                    Adjust Goal
                  </button>
                </>
              )}
            </div>

            {adjustMessage && <p className="text-green-300 mt-3 text-center">{adjustMessage}</p>}

            <div className="mt-4">
              <button className="btn btn-ghost w-full" onClick={toggleCheckins}>
                {showCheckins ? "Hide Check-ins" : `View Check-ins (${(plan as any)?.startedAt ? new Date((plan as any).startedAt).toLocaleDateString() : "—"} → Today)`}
              </button>

              {showCheckins && (
                <div className="mt-4">
                  {checkinsLoading ? (
                    <p>Loading check-ins…</p>
                  ) : checkins.length ? (
                    <div className="checkins-scroll space-y-3">
                      {checkins.map((c: any) => (
                        <div key={c._id} className="bg-white/5 rounded-lg p-3">
                          <p className="text-sm font-medium text-white">{new Date(c.createdAt ?? c.date).toLocaleDateString()}</p>
                          <p className="text-sm text-white/80 mt-1">{c.note || "No note"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-white/70 mt-2">No check-ins yet 🌸</p>
                  )}
                </div>
              )}
            </div>

            <p className="text-white/60 mt-4 text-sm text-center">
              You can tell others: “I’m taking gentle space to heal. I’ll reach out when I’m ready.”
            </p>
          </>
        )}
      </div>

      {/* Pause modal */}
      {showPause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1b1024] p-6 rounded-2xl max-w-sm w-[90%] border border-white/10">
            <h3 className="text-lg font-bold text-pink-300">Take a Gentle Pause</h3>
            <p className="mt-3 text-white/80">Pausing means your journey will restart — and that’s perfectly okay. Healing takes time 💖</p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setShowPause(false)}>Keep Going</button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  setShowPause(false);
                  await pause();
                }}
              >
                Pause Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust modal */}
      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1b1024] p-6 rounded-2xl max-w-sm w-[90%] border border-white/10">
            <h3 className="text-lg font-bold text-pink-300">Adjust Goal</h3>
            <p className="mt-2 text-white/80">Pick a new goal length. This will update your target without restarting your progress.</p>

            <div className="mt-4 flex flex-col gap-2">
              {PRESETS.filter(p => p !== (plan as any)?.days).map(p => (
                <button
                  key={p}
                  className="btn btn-light"
                  onClick={() => handleAdjust(p)}
                  disabled={adjusting}
                >
                  Set {p} days
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button className="text-white/70" onClick={() => setShowAdjust(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
