import { Choices, TChoice } from "@/components/choices";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

const themeChoices: TChoice[] = [
  {
    text: "Mobilité & Stretching",
  },
  {
    text: "Préparation physique",
  },
  {
    text: "Kinésithérapie & Réaltérisation",
  },
  {
    text: "Échauffement",
  },
];

const zoneChoices: TChoice[] = [
  { text: "Membres inférieurs" },
  { text: "Membres supérieurs" },
  { text: "Core" },
];

export default function ExerciseFilterThemes() {
  const [selectedTheme, setSelectedTheme] = useState<TChoice>();
  const [selectedZone, setSelectedZone] = useState<TChoice>();

  return (
    <View className="bg-white flex-1 py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg flex-1">Thématiques</Text>
        <Text className="text-sm text-secondary font-medium">Tout effacer</Text>
      </View>

      <View className="mt-6 gap-6">
        <Choices
          label="Thématiques"
          numColumns={1}
          data={themeChoices}
          selectedChoice={selectedTheme}
          onChange={setSelectedTheme}
        />
        <Choices
          label="Zones"
          numColumns={1}
          data={zoneChoices}
          selectedChoice={selectedZone}
          onChange={setSelectedZone}
        />
      </View>
    </View>
  );
}
