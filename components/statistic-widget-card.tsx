import { StatisticWidget } from "@/constants/mock";
import { View } from "react-native";
import Text from "./text";
import cn from "@/utilities/cn";

export default function StatisticWidgetCard({
  statistic,
  className = "",
}: {
  statistic: StatisticWidget;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "bg-white border border-stroke size-42 p-3 gap-1 rounded-lg",
        className,
      )}
    >
      <Text className="font-medium text-xs text-text">{statistic.title}</Text>
      {statistic.subtitle.length > 0 && (
        <Text className="text-[10px] text-subtleText">
          {statistic.subtitle}
        </Text>
      )}

      {statistic.chart}
    </View>
  );
}
