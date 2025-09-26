// app/providers.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInitUserId } from "./hooks/useInitUserId";
import { View, Text } from "react-native";

export function Providers({ children }: { children: React.ReactNode }) {
  const ready = useInitUserId();

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1b1024" }}>
          <Text style={{ color: "#fff" }}>Preparing Mend…</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
