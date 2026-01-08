import { ISessionNote } from "@/types";
import { View } from "react-native";
import Text from "./text";

export default function SessionNote({ text, title, date }: ISessionNote) {
  return (
    <View className="bg-warmLight border border-decorative rounded-md p-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-text">{title}</Text>
        <Text className="text-xs text-subtleText">{date}</Text>
      </View>
      <Text
        className="flex-1 text-sm text-text leading-6"
        style={{ minHeight: 48 }}
      >
        {text}
      </Text>
    </View>
  );
}
