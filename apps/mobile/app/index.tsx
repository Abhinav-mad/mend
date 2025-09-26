// apps/mobile/app/index.tsx
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#1b1024", padding: 20 }}>
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 6 }}>MEND</Text>
      <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 8, marginBottom: 20 }}>
        Healing through gentle space, reflection, and love
      </Text>

      <Pressable onPress={() => router.push("/gentle-space")} style={{ backgroundColor: "#ff6ea1", padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Gentle Space</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/check-in")} style={{ backgroundColor: "#7c5cff", padding: 14, borderRadius: 16 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Daily Check-In</Text>
      </Pressable>
    </View>
  );
}
