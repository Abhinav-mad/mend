// apps/mobile/components/MoodChip.tsx
import { Pressable, Text } from "react-native";

export default function MoodChip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? "#ff6ea1" : "rgba(255,255,255,0.14)",
        backgroundColor: selected ? "#ff6ea1" : "transparent",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: selected ? "#fff" : "#ffbcd6" }}>{label}</Text>
    </Pressable>
  );
}
