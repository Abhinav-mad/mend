// apps/mobile/app/check-in.tsx
import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCheckIns, addCheckIn, deleteCheckIn } from "../lib/api";
import MoodChip from "../components/MoodChip";

const MOODS = ["tender", "heavy", "hopeful", "wistful", "calm"];

export default function CheckInScreen() {
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const qc = useQueryClient();
  const { data: checkIns = [] } = useQuery(
    {
      queryKey: ["checkins"],
      queryFn: () => getCheckIns(),
      staleTime: 1000 * 60 * 1, // 1 minute


      
    }
  );

  const addMut = useMutation({
    mutationFn: async ({ note }: { note: string }) => {
      const result = await addCheckIn(note);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checkins"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      return await deleteCheckIn(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checkins"] });
    },
  })


  async function handleSave() {
    const payload = `${selectedMood ? selectedMood + " · " : ""}${note}`.trim();
    if (!payload) return;
    await addMut.mutate({ note: payload });
    setNote("");
    setSelectedMood(null);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1024", padding: 18 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>Daily Check-In</Text>
      <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}>How are you feeling right now?</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
        {MOODS.map((m) => (
          <MoodChip  label={m} selected={selectedMood === m} onPress={() => setSelectedMood(m)} />
        ))}
      </View>

      <TextInput
        placeholder="What happened? What helped a little?"
        placeholderTextColor="#bbb"
        value={note}
        onChangeText={setNote}
        style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", borderRadius: 12, padding: 12, marginTop: 14, minHeight: 80 }}
        multiline
      />

      <Pressable onPress={handleSave} style={{ backgroundColor: "#ff6ea1", padding: 14, borderRadius: 12, marginTop: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Save Check-In</Text>
      </Pressable>

      <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 18, marginBottom: 8 }}>Recent entries</Text>

      <FlatList
        data={checkIns}
        keyExtractor={(item) => item._id ?? String(item.createdAt ?? Math.random())}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
              flexDirection: "row",        // 👈 row layout
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

            <Pressable
              onPress={() => setConfirmId(item._id!)} // 👈 open confirm modal
              style={{
                marginLeft: 10,
                padding: 6,
                backgroundColor: "rgba(255,0,0,0.2)",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#ff6ea1", fontWeight: "700" }}>✕</Text>
            </Pressable>
          </View>

        )}
        ListEmptyComponent={<Text style={{ color: "rgba(255,255,255,0.6)" }}>No check-ins yet.</Text>}
      />
      {confirmId && (
        <Pressable
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setConfirmId(null)} // tap outside to close
        >
          <View
            style={{
              backgroundColor: "#1b1024",
              padding: 24,
              borderRadius: 16,
              width: "80%",
            }}
          >
            <Text style={{ color: "#ff6ea1", fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
              Delete Check-In?
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>
              This action cannot be undone.
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable
                onPress={() => setConfirmId(null)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  marginRight: 12,
                }}
              >
                <Text style={{ color: "#ff6ea1", fontWeight: "600" }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  deleteMut.mutate(confirmId);
                  setConfirmId(null);
                }}
                style={{
                  backgroundColor: "#7c5cff",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
