import Text from "@/components/text";
import Button from "@/components/button";
import {
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { cn } from "tailwind-variants";
import IcArrowLeft from "@/components/icons/arrow-left";
import BarChart from "@/components/charts/bar-chart";
import DonutChart from "@/components/charts/donut-chart";
import { ColorConst } from "@/constants/theme";
import { useState } from "react";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import { mockStatistics } from "@/constants/mock";
import StatisticWidgetCard from "../statistic-widget-card";

export const TrainingVolumeChart = () => {
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

export const ActivityDistributionChart = () => {
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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;
    const cardWidth = 168; // size-42 = 168px
    const gap = 8; // gap-2 = 8px
    const padding = 16; // px-4 = 16px

    // Check if scrolled near the end (within 20px threshold)
    const isNearEnd = scrollX + layoutWidth >= contentWidth - 20;

    if (isNearEnd) {
      setActiveIndex(mockStatistics.length - 1);
    } else {
      // Calculate which card is at the center of the screen
      const totalCardWidth = cardWidth + gap;
      const scrollPosition = scrollX + padding;
      const index = Math.round(scrollPosition / totalCardWidth);

      setActiveIndex(Math.max(0, Math.min(index, mockStatistics.length - 1)));
    }
  };

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
          onPress={() => router.push(ROUTE.VIEW_SORT_STATISTICS)}
        />
      </View>

      {/* list */}
      <ScrollView
        horizontal
        contentContainerClassName="gap-2 px-4"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {mockStatistics.map((statistic, index) => (
          <StatisticWidgetCard key={index} statistic={statistic} />
        ))}
      </ScrollView>

      {/* indicator */}
      <View className="flex-row gap-2 self-center">
        {Array.from({ length: mockStatistics.length }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "size-2 rounded-full",
              index === activeIndex ? "bg-primary" : "bg-light",
            )}
          />
        ))}
      </View>
    </View>
  );
};

export default Statistics;
