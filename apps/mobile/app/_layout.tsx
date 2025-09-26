// app/_layout.tsx
import { Stack } from "expo-router";
import { Providers } from "./providers";

export default function Layout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1b1024" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "MEND" }} />
        <Stack.Screen name="gentle-space" options={{ title: "Gentle Space" }} />
        <Stack.Screen name="check-in" options={{ title: "Daily Check-In" }} />
      </Stack>
    </Providers>
  );
}
