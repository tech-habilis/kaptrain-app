import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  const spacing = 24;

  return (
    <ThemedView
      style={{
        display: "flex",
        gap: 24,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: spacing,
      }}
    >
      <ThemedText style={{ fontSize: 24 }}>menu.tips</ThemedText>
    </ThemedView>
  );
}
