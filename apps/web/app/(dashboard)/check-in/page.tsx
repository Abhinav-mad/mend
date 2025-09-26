'use client';

import { useState, useEffect } from "react";
import { createCheckIn, fetchCheckIns, deleteCheckIn } from "../../../lib/api";

const MOODS = ["tender", "heavy", "hopeful", "wistful", "calm"];

export default function CheckInPage() {
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // --- Load check-ins
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchCheckIns();
        setCheckIns(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Save
  async function save() {
    try {
      setStatus("saving");
      const newEntry = await createCheckIn({ mood, note });
      setCheckIns((prev) => [newEntry, ...prev]);
      setStatus("saved");
      setError(null);
      setNote("");
      setMood(null);
      setTimeout(() => setStatus("idle"), 1400);
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Failed to save");
    }
  }

  // --- Delete
  async function handleDelete(id: string) {
    await deleteCheckIn(id);
    setCheckIns((prev) => prev.filter((c) => c._id !== id));
    setConfirmId(null);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-bold">Daily Check-In</h2>
      </header>

      {/* Input card */}
      <div className="card p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`btn ${mood === m ? "btn-primary" : "btn-ghost"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          placeholder="What happened? What helped a little?"
          className="w-full min-h-[140px] rounded-2xl p-4 bg-white/10 outline-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="btn btn-primary"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span className="text-green-300">Saved ✓</span>}
          {status === "error" && <span className="text-red-300">{error}</span>}
        </div>
      </div>

      {/* Entries */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Recent entries</h3>
        {loading && <p className="text-white/70">Loading…</p>}
        {!loading && checkIns.length === 0 && (
          <p className="text-white/60">No check-ins yet.</p>
        )}
        <div className="checkins-scroll space-y-3">
          {checkIns.map((c) => (
            <div
              key={c._id}
              className="card p-4 flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-pink-200">
                  {new Date(c.createdAt ?? Date.now()).toLocaleString()}
                </p>
                {c.mood && <p className="mt-1 font-medium text-white">{c.mood}</p>}
                {c.note && <p className="mt-1 text-white/80">{c.note}</p>}
              </div>
              <button
                onClick={() => setConfirmId(c._id)}
                className="text-red-400 hover:text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Delete confirm */}
 {confirmId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-[#1b1024] p-6 rounded-2xl max-w-sm w-[90%] border border-white/10">
      <h3 className="text-lg font-bold text-pink-300">Delete Check-In?</h3>
      <p className="mt-3 text-white/80">
        This action cannot be undone
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          className="btn btn-ghost"
          onClick={() => setConfirmId(null)}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary bg-[#7c5cff] hover:bg-[#6a4ae0]"
          onClick={() => handleDelete(confirmId)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
