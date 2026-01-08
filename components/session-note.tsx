import { TextInput, View } from "react-native";
import Text from "./text";
import IcClose from "./icons/close";
import { useState } from "react";
import { ColorConst } from "@/constants/theme";

export default function SessionNote() {
  const [note, setNote] = useState("");
  return (
    <View className="bg-warmLight border border-decorative rounded-md p-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-text">Note personnalisée</Text>
        <IcClose />
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Écrivez ici"
        placeholderTextColor={ColorConst.subtleText}
        multiline
        className="flex-1 text-sm text-text leading-6"
        style={{ minHeight: 48 }}
      />
    </View>
  );
}
