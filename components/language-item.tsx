import { Pressable } from "react-native";
import { ThemedText } from "./themed-text";

export function LanguageItem({
  language,
  isSelected,
  onSelect,
}: {
  language: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: isSelected
          ? "rgba(56, 156, 156)"
          : "rgba(56, 156, 156, 0.1)",
        padding: 24,
      }}
      onPress={onSelect}
    >
      <ThemedText
        style={{
          fontSize: 24,
          textAlign: "center",
        }}
      >
        {language.toUpperCase()}
      </ThemedText>
    </Pressable>
  );
}
