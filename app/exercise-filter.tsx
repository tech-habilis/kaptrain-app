import CircleBadge from "@/components/circle-badge";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { clsx } from "clsx";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

type FilterItem = {
  id: string;
  text: string;
  count: number;
  disabled: boolean;
  onPress: () => void;
};

const FilterItemCard = ({ item }: { item: FilterItem }) => {
  return (
    <Pressable
      onPress={item.onPress}
      className={clsx(
        "rounded-lg flex-row items-center gap-3 border border-stroke overflow-hidden pl-4 py-3 pr-2",
        { "opacity-60": item.disabled },
      )}
    >
      <Text className="text-text font-semibold text-sm">{item.text}</Text>
      <CircleBadge
        text={item.count.toString()}
        className={clsx("size-8", { "opacity-0": item.count < 1 })}
        textClassName={"text-base"}
      />
      <View className="grow" />
      <View className="rotate-180">
        <IcArrowLeft />
      </View>
    </Pressable>
  );
};

export default function ExerciseFilter() {
  const filters: FilterItem[] = [
    {
      id: "1",
      text: "Sports",
      count: 1,
      disabled: false,
      onPress: () => router.push(ROUTE.EXERCISE_FILTER_SPORTS),
    },
    {
      id: "2",
      text: "Thématiques",
      count: 0,
      disabled: false,
      onPress: () => router.push(ROUTE.EXERCISE_FILTER_THEMES),
    },
    {
      id: "3",
      text: "Matériels",
      count: 0,
      disabled: true,
      onPress: () => {},
    },
    {
      id: "4",
      text: "Muscles",
      count: 0,
      disabled: false,
      onPress: () => router.push(ROUTE.EXERCISE_FILTER_MUSCLES),
    },
  ];

  return (
    <View className="bg-white flex-1 py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg flex-1">Filtres</Text>
        <Text className="text-sm text-secondary font-medium">Tout effacer</Text>
      </View>

      <View className="mt-6 gap-3">
        {filters.map((x, index) => (
          <FilterItemCard key={index} item={x} />
        ))}
      </View>
    </View>
  );
}
