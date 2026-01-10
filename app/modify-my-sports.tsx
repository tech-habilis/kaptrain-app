import { useState } from "react";
import { router, Stack } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import IcClose from "@/components/icons/close";
import IcSearch from "@/components/icons/search";
import IcCheckboxSelected from "@/components/icons/checkbox-selected";
import IcCheckbox from "@/components/icons/checkbox";
import IcLightning from "@/components/icons/lightning";
import IcCrossfit from "@/components/icons/crossfit";
import IcCycling from "@/components/icons/cycling";
import IcRowing from "@/components/icons/rowing";
import IcBasketball from "@/components/icons/basketball";
import IcBodybuilding from "@/components/icons/bodybuilding";
import IcYoga from "@/components/icons/yoga";
import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import cn from "@/utilities/cn";

const MAX_SPORTS = 5;

type SportOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

// Using IcLightning as placeholder for athletics
const ALL_SPORTS: SportOption[] = [
  {
    id: "athletics",
    name: "Athlétisme",
    icon: <IcLightning size={24} color={ColorConst.accent} />,
  },
  { id: "rowing", name: "Aviron", icon: <IcRowing size={24} /> },
  { id: "basketball", name: "Basketball", icon: <IcBasketball size={24} /> },
  { id: "crossfit", name: "Crossfit", icon: <IcCrossfit size={24} /> },
  { id: "cycling", name: "Cyclisme", icon: <IcCycling size={24} /> },
  {
    id: "bodybuilding",
    name: "Musculation",
    icon: <IcBodybuilding size={24} />,
  },
  { id: "yoga", name: "Yoga", icon: <IcYoga size={24} /> },
  { id: "basketball-2", name: "Basketball", icon: <IcBasketball size={24} /> },
  { id: "wheelchair-basketball", name: "Basket fauteuil", icon: null },
  { id: "beach-volleyball", name: "Beach volley", icon: null },
  { id: "biathlon", name: "Biathlon", icon: null },
  { id: "bmx", name: "BMX", icon: null },
  { id: "boccia", name: "Boccia", icon: null },
  { id: "boxing", name: "Boxe", icon: null },
];

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

function SportOptionItem({
  sport,
  isSelected,
  isDisabled,
  onPress,
}: {
  sport: SportOption;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled && !isSelected}
      className={cn(
        "h-12 flex-row items-center justify-between px-3 rounded-lg",
        isSelected
          ? "bg-light border-2 border-primary"
          : "bg-white border border-stroke",
      )}
    >
      <View className="flex-row items-center gap-1.5 flex-1">
        {sport.icon && <View className="shrink-0">{sport.icon}</View>}
        <Text className="text-text text-base font-medium">{sport.name}</Text>
      </View>
      <View className="shrink-0">
        {isSelected ? (
          <IcCheckboxSelected size={24} />
        ) : (
          <IcCheckbox size={24} />
        )}
      </View>
    </Pressable>
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
                placeholder="Rechercher un sport"
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
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-8 bg-gradient-to-t from-white via-white to-transparent">
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
