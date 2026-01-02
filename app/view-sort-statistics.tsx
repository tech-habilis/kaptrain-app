import IcArrowLeft from "@/components/icons/arrow-left";
import StatisticWidgetCard from "@/components/statistic-widget-card";
import Text from "@/components/text";
import { mockStatistics } from "@/constants/mock";
import { View } from "react-native";

export default function ViewSortStatistics() {
  return (
    <View className="py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <IcArrowLeft />
        <Text className="font-bold text-lg">Toutes mes statistiques</Text>
      </View>

      <View className="flex flex-row flex-wrap gap-2 mt-6">
        {mockStatistics.map((x, index) => (
          <StatisticWidgetCard key={index} statistic={x} className="flex-1" />
        ))}
      </View>
    </View>
  );
}
