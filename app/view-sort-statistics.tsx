import Button from "@/components/button";
import { mockStatistics } from "@/components/home/statistics";
import IcArrowLeft from "@/components/icons/arrow-left";
import StatisticWidgetCard from "@/components/statistic-widget-card";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";

export default function ViewSortStatistics() {
  return (
    <View className="py-safe px-4 bg-white h-full">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg">Toutes mes statistiques</Text>
      </View>

      <FlatList
        data={mockStatistics}
        renderItem={({ item }) => (
          <StatisticWidgetCard statistic={item} className="flex-1" />
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        // contentContainerStyle={{ gap: 8 }}
        contentContainerClassName="gap-2"
        columnWrapperClassName="gap-2"
        className="mt-6"
      />

      <View className="grow" />

      <Button
        text="Modifier mes statistiques"
        className="mb-6"
        onPress={() => router.push(ROUTE.EDIT_SORT_STATISTICS)}
      />
    </View>
  );
}
