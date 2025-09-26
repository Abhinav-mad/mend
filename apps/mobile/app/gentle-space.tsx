// apps/mobile/app/gentle-space.tsx
import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Modal, Alert, FlatList } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentSpace, startSpace, pauseSpace, adjustSpace, getCheckIns, CheckIn } from "../lib/api";
import ProgressBloom from "../components/ProgressBloom";
import { computeProgress } from "../lib/progress";

const PRESETS = [21, 45, 90];

export default function GentleSpaceScreen() {
  const qc = useQueryClient();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustSuccessMsg, setAdjustSuccessMsg] = useState<string | null>(null);
  const [showCheckins, setShowCheckins] = useState(false);

  const { data: space, isLoading } = useQuery({
    queryKey: ["space"],
    queryFn: getCurrentSpace,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const { data: checkins =[], isLoading: checkinsLoading } = useQuery<CheckIn[]>({
  queryKey: ["checkins",space?.startedAt],
  queryFn: () => getCheckIns(space?.startedAt),
  enabled: !!space && showCheckins, // fetch only if toggled + space exists
});
  // helper: compute next goal candidate (first PRESET > current). returns null if none
  function computeNextPreset(currentDays?: number | null) {
    if (!currentDays || typeof currentDays !== "number" || currentDays <= 0) return PRESETS[0];
    const higher = PRESETS.find((p) => p > currentDays);
    return higher ?? null;
  }

  const startMut = useMutation({
    mutationFn: async ({ days }: { days: number }) => {
      const result = await startSpace(days);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["space"] });
      setAdjustSuccessMsg(null);
    },
  });

  const adjustMut = useMutation({
    mutationFn: async ({ days }: { days: number }) => {
      const result = await adjustSpace(days);
      return result;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["space"] });
      setShowAdjustModal(false);
      setAdjustSuccessMsg(`Goal updated to ${variables.days} days`);
      // clear message after a few seconds
      setTimeout(() => setAdjustSuccessMsg(null), 3500);
    },
    onError: (err :any) =>  {
    if (err?.response?.data?.code === "NEW_GOAL_BELOW_PROGRESS") {
      Alert.alert("Invalid Goal", err.response.data.message);
    } else {
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  },
  });

  const pauseMut = useMutation({
    mutationFn: pauseSpace,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["space"] }),
    onError: (err) => console.error("pause err", err),
  });

  const prog = computeProgress(space ?? null);

  const handlePausePress = () => {
    // if already paused, pressing will call pauseMut (same behavior as prior)
    if ((space as any)?.status === "paused") {
      pauseMut.mutate();
    } else {
      setShowPauseModal(true);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1b1024", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#ff6ea1" />
      </View>
    );
  }

  const active = space && (space as any).status === "active";
  const currentDays = (space as any)?.days ?? undefined;
  const nextPresetCandidate = computeNextPreset(currentDays);

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1024", padding: 18 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>Gentle Space</Text>

      {space && (space as any).status !== "inactive" ? (
        <View style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.06)", padding: 14, borderRadius: 12 }}>
          <Text style={{ color: "#fff" }}>Status: {(space as any).status}</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
            Started: {space!.startedAt ? new Date(space!.startedAt).toLocaleDateString() : "—"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Goal: {space!.days} days</Text>
        </View>
      ) : (
        <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 12 }}>No active gentle space. Start one below:</Text>
      )}

      <View style={{ marginTop: 18 }}>
        <ProgressBloom pct={prog.pct} daysText={`Day ${prog.days} / ${space?.days ?? PRESETS[0]}`} />
      </View>

      <View style={{ marginTop: 22 }}>
        {!active ? (
          PRESETS.map((d) => (
            <Pressable
              key={d}
              onPress={() => startMut.mutate({ days: d })}
              disabled={startMut.isPending}
              style={{
                backgroundColor: startMut.isPending ? "rgba(255,110,161,0.6)" : "#ff6ea1",
                padding: 14,
                borderRadius: 12,
                marginBottom: 10,
                opacity: startMut.isPending ? 0.9 : 1,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Start {d}-Day Gentle Space</Text>
            </Pressable>
          ))
        ) : (
          <>
            <Pressable
              onPress={handlePausePress}
              style={{ backgroundColor: "#7c5cff", padding: 14, borderRadius: 12, marginBottom: 10 }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                {(space as any).status === "paused" ? "Resume" : "Pause"} Gentle Space
              </Text>
            </Pressable>

            {/* Adjust button opens a small modal where user chooses desired preset (allows going up/down) */}
            {currentDays ? (
              <Pressable
                onPress={() => setShowAdjustModal(true)}
                style={{ backgroundColor: "#ff9ab8", padding: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#1b1024", textAlign: "center", fontWeight: "700" }}>
                  Adjust Goal (Choose new length)
                </Text>
              </Pressable>
            ) : nextPresetCandidate ? (
              <Pressable
                onPress={() => adjustMut.mutate({ days: nextPresetCandidate })}
                style={{ backgroundColor: "#ff9ab8", padding: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#1b1024", textAlign: "center", fontWeight: "700" }}>
                  Adjust Goal (Try {nextPresetCandidate})
                </Text>
              </Pressable>
            ) : null}
          </>
        )}

        {/* gentle success message after adjust */}
        {adjustSuccessMsg && (
          <Text style={{ color: "#b6ffdb", marginTop: 12, textAlign: "center" }}>{adjustSuccessMsg}</Text>
        )}

        <Pressable
  onPress={() => setShowCheckins(!showCheckins)}
  style={{
    backgroundColor: "#ffa7c4",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  }}
>
  <Text style={{ color: "#1b1024", textAlign: "center", fontWeight: "700" }}>
    {showCheckins
      ? "Hide Check-ins"
      : `View Check-ins (${new Date((space as any)!.startedAt).toLocaleDateString()} → Today)`}
  </Text>
</Pressable>

{showCheckins && (
  <View style={{ marginTop: 16, maxHeight: 350 /* reasonable max so list scrolls */ }}>
    {checkinsLoading ? (
      <ActivityIndicator color="#ff6ea1" />
    ) : checkins?.length ? (
      <FlatList
        data={checkins}
        keyExtractor={(item) => item._id ?? String(item.createdAt ?? Math.random())}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffbcd6", fontSize: 12 }}>
                {new Date(item.createdAt ?? item.date ?? Date.now()).toLocaleString()}
              </Text>
              <Text style={{ color: "#fff", marginTop: 6 }}>{item.note ?? item.mood}</Text>
            </View>


          </View>
        )}
        showsVerticalScrollIndicator
      />
    ) : (
      <Text style={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
        No check-ins yet 🌸
      </Text>
    )}
  </View>
)}
        {/* Pause confirmation modal (you already had this) */}
        <Modal transparent visible={showPauseModal} animationType="fade">
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "#1b1024", padding: 24, borderRadius: 20, width: "80%", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
              <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#ff6ea1" }}>Take a Gentle Pause</Text>
              <Text style={{ fontSize: 15, marginBottom: 20, color: "rgba(255,255,255,0.85)" }}>
                Pausing means your journey will restart — and that’s perfectly okay. Healing takes time 💖
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Pressable onPress={() => setShowPauseModal(false)} style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)", marginRight: 12 }}>
                  <Text style={{ color: "#ff6ea1", fontWeight: "600" }}>Keep Going</Text>
                </Pressable>

                <Pressable onPress={() => { setShowPauseModal(false); pauseMut.mutate(); }} style={{ backgroundColor: "#7c5cff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Pause Now</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Adjust modal - lets user pick any preset (except current) */}
        <Modal transparent visible={showAdjustModal} animationType="fade">
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "#1b1024", padding: 20, borderRadius: 16, width: "86%", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
              <Text style={{ color: "#ff6ea1", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>Adjust Goal</Text>
              <Text style={{ color: "rgba(255,255,255,0.85)", marginBottom: 12 }}>Pick a new goal length. This will update your target without restarting your progress.</Text>

              {PRESETS.filter(p => p !== currentDays).map(p => (
                <Pressable
                  key={p}
                  onPress={() => adjustMut.mutate({ days: p })}
                  disabled={adjustMut.isPending}
                  style={{
                    backgroundColor: adjustMut.isPending ? "rgba(255,154,184,0.6)" : "#ff9ab8",
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#1b1024", fontWeight: "700", textAlign: "center" }}>Set {p} days</Text>
                </Pressable>
              ))}

              <Pressable onPress={() => setShowAdjustModal(false)} style={{ marginTop: 6, alignSelf: "center" }}>
                <Text style={{ color: "rgba(255,255,255,0.7)" }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
}
