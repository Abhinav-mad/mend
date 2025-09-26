// apps/mobile/components/ProgressBloom.tsx
import { View, Text } from "react-native";

export default function ProgressBloom({ pct, daysText }: { pct: number; daysText?: string }) {
  return (
    <View style={{ width: "100%", marginTop: 12 }}>
      <View style={{ height: 12, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
        <View style={{ height: 12, backgroundColor: "#ff6ea1", width: `${pct}%`, borderRadius: 12 }} />
      </View>
      <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 8, textAlign: "center" }}>
        {Math.round(pct)}% · {daysText ?? ""}
      </Text>
    </View>
  );
}
