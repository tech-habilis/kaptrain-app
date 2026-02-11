import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { mockSports, sportChoices } from "@/constants/mock";
import FilterAndSelectModal from "@/components/filter-and-select-modal";

export default function ExerciseFilterSports() {
  const [selectedSport, setSelectedSport] = useState<TChoice>();
  const [selectedChoices, setSelectedChoices] = useState<TChoice[]>([
    sportChoices[0],
  ]);

  const [showAddSport, setShowAddSport] = useState(false);

  return (
    <View className="bg-white flex-1 py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-ls-bold text-lg flex-1">Sports</Text>
        <Text className="text-sm text-secondary font-medium">Tout effacer</Text>
      </View>

      <View className="mt-6 gap-3">
        <Choices
          numColumns={2}
          data={mockSports}
          selectedChoice={selectedSport}
          onChange={setSelectedSport}
        />
        <Button
          text="Ajouter un sport"
          leftIcon={<IcPlus color={ColorConst.accent} size={24} />}
          type="tertiary"
          onPress={() => setShowAddSport(true)}
        />
      </View>

      <FilterAndSelectModal
        name="add-sport-modal"
        choices={sportChoices}
        selectedChoices={selectedChoices}
        onSelected={(selected) => setSelectedChoices(selected as TChoice[])}
        show={showAddSport}
        onDismiss={() => setShowAddSport(false)}
      />
    </View>
  );
}
