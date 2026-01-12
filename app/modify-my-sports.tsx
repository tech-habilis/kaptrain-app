import { useState } from "react";
import { router, Stack } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import IcClose from "@/components/icons/close";
import IcSearch from "@/components/icons/search";
import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import { ALL_SPORTS } from "@/constants/mock";
import SportOptionItem from "@/components/sport-option-item";

const MAX_SPORTS = 5;

const INITIAL_SELECTED_SPORTS = [
  "athletics",
  "crossfit",
  "cycling",
  "hyrox",
  "rowing",
];

function SelectedSportChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  return (
    <View className="bg-secondary flex-row items-center gap-1.5 h-8 pl-2 pr-2.5 rounded">
      <Text className="text-white text-sm font-medium">{name}</Text>
      <Pressable onPress={onRemove} className="p-0.5">
        <IcClose size={12} color={ColorConst.light} />
      </Pressable>
    </View>
  );
}

export default function ModifyMySportsScreen() {
  const [selectedSports, setSelectedSports] = useState<string[]>(
    INITIAL_SELECTED_SPORTS,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const isLimitReached = selectedSports.length >= MAX_SPORTS;

  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        return prev.filter((id) => id !== sportId);
      }
      if (isLimitReached) {
        return prev;
      }
      return [...prev, sportId];
    });
  };

  const removeSport = (sportId: string) => {
    setSelectedSports((prev) => prev.filter((id) => id !== sportId));
  };

  const getSelectedSportName = (sportId: string) => {
    return ALL_SPORTS.find((s) => s.id === sportId)?.name || sportId;
  };

  const filteredSports = ALL_SPORTS.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BasicScreen
        title="Modifier mes sports"
        description="Choisis les sports que tu pratiques pour adapter ton suivi et tes exercices"
        headerClassName="bg-light"
      >
        <View className="flex-1 bg-white">
          {/* Content */}
          <ScrollView className="flex-1 px-4 pt-6 pb-32">
            {/* Selected Sports */}
            <View className="flex-col gap-2 mb-6">
              <View className="flex flex-row flex-wrap gap-2">
                {selectedSports.map((sportId) => (
                  <SelectedSportChip
                    key={sportId}
                    name={getSelectedSportName(sportId)}
                    onRemove={() => removeSport(sportId)}
                  />
                ))}
              </View>
              {isLimitReached && (
                <Text className="text-subtleText text-sm">
                  {`${selectedSports.length} sélectionnés : limite atteinte`}
                </Text>
              )}
            </View>

            {/* Search */}
            <View className="flex-row gap-3 items-center mb-6">
              <Input
                className="flex-1"
                leftIcon={<IcSearch size={16} />}
                value={searchQuery}
                onChangeText={setSearchQuery}
                inputClassName="text-sm"
              />
              <Pressable onPress={() => setSearchQuery("")}>
                <IcClose size={24} color={ColorConst.accent} />
              </Pressable>
            </View>

            {/* Sports List */}
            <View className="flex-col gap-2">
              {filteredSports.map((sport) => {
                const isSelected = selectedSports.includes(sport.id);
                const isDisabled = isLimitReached && !isSelected;

                return (
                  <SportOptionItem
                    key={sport.id}
                    sport={sport}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onPress={() => toggleSport(sport.id)}
                  />
                );
              })}
            </View>
          </ScrollView>

          {/* CTA */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-8 bg-linear-to-t from-white via-white to-transparent">
            <Button
              text="Modifier mes sports"
              onPress={() => router.back()}
              className="h-14"
            />
          </View>
        </View>
      </BasicScreen>
    </>
  );
}
