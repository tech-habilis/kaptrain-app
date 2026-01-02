import Text from "@/components/text";
import Button from "@/components/button";
import { View, ScrollView } from "react-native";
import { cn } from "tailwind-variants";
import IcArrowLeft from "@/components/icons/arrow-left";
import BarChart from "@/components/charts/bar-chart";
import DonutChart from "@/components/charts/donut-chart";
import { ColorConst } from "@/constants/theme";

const TrainingVolumeChart = () => {
  return (
    <View>
      <BarChart
        data={[
          { x: "M", y: 0 },
          { x: "T", y: 8 },
          { x: "W", y: 7 },
          { x: "T", y: 0 },
          { x: "F", y: 4 },
          { x: "S", y: 3 },
          { x: "S", y: 0 },
        ]}
        height={85}
      />
      <Text className="text-base font-semibold">13h20</Text>
    </View>
  );
};

const ActivityDistributionChart = () => {
  const data = [
    { label: "Hyrox", value: 5, color: ColorConst.primary },
    { label: "Course à\npieds", value: 60, color: ColorConst.tertiary },
    { label: "Yoga", value: 5, color: ColorConst.decorative },
    { label: "Cyclisme", value: 15, color: "#88D18A" },
    { label: "Aviron", value: 10, color: ColorConst.secondary },
    { label: "Autres", value: 5, color: ColorConst.subtleText },
  ];

  return (
    <View className="flex-row flex-1">
      <View className="w-[70%] items-start">
        <DonutChart data={data} strokeWidth={16} />
      </View>

      <View className="gap-1.5 ">
        {data.map((activity) => (
          <View key={activity.label} className="flex-row items-center gap-1">
            <View
              className="size-1.25 rounded-full"
              style={{ backgroundColor: activity.color }}
            />
            <Text className="text-[8px]">{activity.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Statistics = () => {
  const statistics = [
    {
      title: "Répartition d'activité",
      subtitle: "Aujourd'hui",
      chart: <ActivityDistributionChart />,
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
      chart: <TrainingVolumeChart />,
    },
    {
      title: "Répartition d'activité",
      subtitle: "Aujourd'hui",
      chart: <ActivityDistributionChart />,
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
      chart: <TrainingVolumeChart />,
    },
    {
      title: "Répartition d'activité",
      subtitle: "Aujourd'hui",
      chart: <ActivityDistributionChart />,
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
