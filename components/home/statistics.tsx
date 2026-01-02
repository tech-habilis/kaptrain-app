import Text from "@/components/text";
import Button from "@/components/button";
import { View, ScrollView } from "react-native";
import { cn } from "tailwind-variants";
import IcArrowLeft from "@/components/icons/arrow-left";
import BarChart from "@/components/charts/bar-chart";
import { ColorConst } from "@/constants/theme";

const Statistics = () => {
  const statistics = [
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
      chart: (
        <BarChart
          data={[
            { x: "M", y: 1, color: ColorConst.light },
            { x: "T", y: 8 },
            { x: "W", y: 7 },
            { x: "T", y: 1, color: ColorConst.light },
            { x: "F", y: 4 },
            { x: "S", y: 3 },
            { x: "S", y: 1, color: ColorConst.light },
          ]}
          height={110}
        />
      ),
    },
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
    },
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
  ];

  return (
    <View className="bg-white py-4 gap-4">
      <View className="flex-row justify-between items-center mx-4">
        <Text className="font-bold text-base text-secondary">
          Mes statistiques
        </Text>
        <Button
          text="Tout voir"
          type="link"
          size="small"
          textClassName="text-secondary"
          rightIcon={
            <View className="rotate-180">
              <IcArrowLeft size={16} />
            </View>
          }
        />
      </View>

      {/* list */}
      <ScrollView
        horizontal
        contentContainerClassName="gap-2 px-4"
        showsHorizontalScrollIndicator={false}
      >
        {statistics.map((statistic, index) => (
          <View
            key={index}
            className="bg-white border border-stroke size-42 p-3 gap-1 rounded-lg"
          >
            <Text className="font-medium text-xs text-text">
              {statistic.title}
            </Text>
            <Text className="text-[10px] text-subtleText">
              {statistic.subtitle}
            </Text>

            {statistic.chart}
          </View>
        ))}
      </ScrollView>

      {/* indicator */}
      <View className="flex-row gap-2 self-center">
        {Array.from({ length: statistics.length }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "size-2 rounded-full",
              index === 0 ? "bg-primary" : "bg-light",
            )}
          />
        ))}
      </View>
    </View>
  );
};

export default Statistics;
