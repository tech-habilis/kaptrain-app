import IcArrowLeft from "@/components/icons/arrow-left";
import StatisticWidgetCard from "@/components/statistic-widget-card";
import Text from "@/components/text";
import { mockStatistics } from "@/constants/mock";
import { FlatList, View } from "react-native";

export default function ViewSortStatistics() {
  return (
    <View className="py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <IcArrowLeft />
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
    </View>
  );
}
