import Text from "@/components/text";
import Button from "@/components/button";
import {
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { cn } from "tailwind-variants";
import IcArrowLeft from "@/components/icons/arrow-left";
import BarChart from "@/components/charts/bar-chart";
import DonutChart from "@/components/charts/donut-chart";
import { ColorConst } from "@/constants/theme";
import { useState } from "react";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import StatisticWidgetCard from "../statistic-widget-card";
import { StatisticWidget } from "@/constants/mock";
import CircularProgress, {
  CircularProgressProps,
} from "@/components/charts/circular-progress";
import LineChart from "@/components/charts/line-chart";
import IcMuscular from "../icons/muscular";
import IcHyrox from "../icons/hyrox";
import IcYoga from "../icons/yoga";
import IcCycling from "../icons/cycling";
import IcRowing from "../icons/rowing";
import NoDataChart from "../no-data-chart";

export const TrainingVolumeChart = ({
  withTotal = false,
}: {
  withTotal?: boolean;
}) => {
  return (
    <View>
      <BarChart
        data={[
          { x: "D", y: 0 },
          { x: "L", y: 8 },
          { x: "M", y: 7 },
          { x: "M", y: 0 },
          { x: "J", y: 4 },
          { x: "V", y: 3 },
          { x: "Auj", y: 0 },
        ]}
        height={85}
      />
      {withTotal && <Text className="text-base font-semibold">13h20</Text>}
    </View>
  );
};

export const activityDistributionData = [
  {
    label: "Course à pieds",
    value: 60,
    color: ColorConst.tertiary,
    icon: <IcMuscular size={24} />,
  },
  {
    label: "Hyrox",
    value: 5,
    color: ColorConst.primary,
    icon: <IcHyrox size={24} />,
  },
  {
    label: "Yoga",
    value: 5,
    color: ColorConst.decorative,
    icon: <IcYoga size={24} />,
  },
  {
    label: "Cyclisme",
    value: 15,
    color: "#88D18A",
    icon: <IcCycling size={24} />,
  },
  {
    label: "Aviron",
    value: 10,
    color: ColorConst.secondary,
    icon: <IcRowing size={24} />,
  },
  { label: "Autres", value: 5, color: ColorConst.subtleText },
];

export const ActivityDistributionChart = () => {
  return (
    <View className="flex-row flex-1">
      <View className="w-[70%] items-start">
        <DonutChart data={activityDistributionData} />
      </View>

      <View className="gap-1.5">
        {activityDistributionData.map((activity) => (
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

export const ActivityDistributionChartDetail = ({
  withDate = false,
}: {
  withDate?: boolean;
}) => {
  const [showNotFound, setShowNotFound] = useState(false);
  return (
    <View className="flex-1">
      {withDate && (
        <View className="flex-row items-center justify-center mb-6 gap-3">
          <Pressable onPress={() => setShowNotFound(false)}>
            <IcArrowLeft size={16} />
          </Pressable>
          <Text className="text-base text-secondary">
            Du 14 avril au 20 avril
          </Text>
          <Pressable
            onPress={() => setShowNotFound(true)}
            className="rotate-180"
          >
            <IcArrowLeft size={16} />
          </Pressable>
        </View>
      )}

      {showNotFound ? (
        <NoDataChart className="mt-6" />
      ) : (
        <>
          <View className="px-14 py-2">
            <DonutChart data={activityDistributionData} />
          </View>

          <FlatList
            data={activityDistributionData}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperClassName="gap-2"
            contentContainerClassName="gap-1.5 mt-8"
            renderItem={({ item }) => (
              <View
                key={item.label}
                className="flex-row items-center gap-1 flex-1/2"
              >
                <View
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-subtleText">
                  {`${item.label} (${item.value}%)`}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

export const NumberOfSessionChart = () => {
  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-center mb-6 gap-3">
        <IcArrowLeft size={16} />
        <Text className="text-base text-secondary">
          Du 14 avril au 20 avril
        </Text>
        <View className="rotate-180">
          <IcArrowLeft size={16} />
        </View>
      </View>
      <View className="px-14 py-2">
        <DonutChart
          data={activityDistributionData}
          labelFormatter={(data) => data.value.toString()}
        />
      </View>

      <FlatList
        data={activityDistributionData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperClassName="gap-2"
        contentContainerClassName="gap-1.5 mt-8"
        renderItem={({ item }) => (
          <View
            key={item.label}
            className="flex-row items-center gap-1 flex-1/2"
          >
            <View
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Text className="text-subtleText">
              {`${item.label} (${item.value})`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export const NumberOfStepsChart = ({
  current = 8_416,
  total = 10_000,
  size = 100,
  strokeWidth = 8,
  backgroundColor = "#F5F6FD",
  progressColor = ColorConst.secondary,
  title = "Pas",
  ...otherProgressProps
}: Partial<CircularProgressProps>) => {
  return (
    <View className="items-center justify-center flex-1">
      <CircularProgress
        current={current}
        total={total}
        size={size}
        strokeWidth={strokeWidth}
        backgroundColor={backgroundColor}
        progressColor={progressColor}
        title={title}
        {...otherProgressProps}
      />
    </View>
  );
};

export const WeightTrackingChart = () => {
  return (
    <LineChart
      data={[
        { x: "Jan", y: 45 },
        { x: "Fev", y: 60 },
        { x: "Fev", y: 55 },
        { x: "Mar", y: 80 },
        { x: "Mar", y: 68 },
        { x: "Avr", y: 76 },
        { x: "Avr", y: 80 },
      ]}
      height={240}
      minY={20}
      maxY={150}
      lineColor={ColorConst.primary}
      lineWidth={2}
      backgroundColor={ColorConst.light}
      showDots={false}
      withCurvedLines={true}
      showXAxisIndices={[0, 2, 4, 6]}
      barSpacing={2}
    />
  );
};

const mockActivityTime = [
  {
    title: "Aujourd'hui",
    time: "2h51",
    color: ColorConst.primary,
    bgColor: ColorConst.light,
  },
  {
    title: "Cette semaine",
    time: "13h35",
    color: ColorConst.decorative,
    bgColor: ColorConst.warmLight,
  },
  {
    title: "Ce mois-ci",
    time: "48h12",
    color: ColorConst.tertiary,
    bgColor: ColorConst.warmLight,
  },
];

export const ActivityTimeChart = () => {
  return (
    <View className="gap-3 mt-1">
      {mockActivityTime.map((item, index) => (
        <View key={index} className="flex-row items-center">
          <View
            style={{ backgroundColor: item.bgColor }}
            className="p-1 rounded-full"
          >
            <View
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </View>
          <View>
            <Text className="ml-2 text-[10px] text-subtleText">
              {item.title}
            </Text>
            <Text className="ml-2 font-semibold text-text">{item.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
export const ActivityTimeChartDetail = () => {
  const data = [
    {
      title: "Aujourd'hui",
      time: "2 heures 51 minutes",
      color: ColorConst.primary,
      bgColor: ColorConst.light,
    },
    {
      title: "Cette semaine",
      time: "13 heures 35 minutes",
      color: ColorConst.decorative,
      bgColor: ColorConst.warmLight,
    },
    {
      title: "Ce mois-ci",
      time: "48 heures 12 minutes",
      color: ColorConst.tertiary,
      bgColor: ColorConst.warmLight,
    },
    {
      title: "Cette année",
      time: "21 jours, 16 heures et 5 minutes",
      color: ColorConst.secondary,
      bgColor: ColorConst.light,
    },
  ];

  return (
    <View className="gap-8">
      {data.map((item, index) => (
        <View key={index} className="flex-row items-center">
          <View
            style={{ backgroundColor: item.bgColor }}
            className="p-2 rounded-full"
          >
            <View
              className="size-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </View>
          <View className="ml-4">
            <Text className="text-sm text-subtleText">{item.title}</Text>
            <Text className="text-base font-semibold text-text">
              {item.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export const mockStatistics: StatisticWidget[] = [
  {
    title: "Répartition d'activité",
    subtitle: "Aujourd'hui",
    chart: <ActivityDistributionChart />,
    chartDetail: <ActivityDistributionChartDetail />,
    route: ROUTE.ACTIVITY_DISTRIBUTION,
  },
  {
    title: "Volume d'entrainement",
    subtitle: "7 derniers jours",
    chart: <TrainingVolumeChart withTotal />,
    route: ROUTE.TRAINING_VOLUME,
  },
  {
    title: "Suivi de poids",
    subtitle: "01 janvier - 30 juillet",
    chart: (
      <LineChart
        data={[
          { x: "Jan", y: 45 },
          { x: "Fev", y: 60 },
          { x: "Fev", y: 55 },
          { x: "Mar", y: 80 },
          { x: "Mar", y: 68 },
          { x: "Avr", y: 76 },
          { x: "Avr", y: 80 },
        ]}
        height={110}
        minY={20}
        maxY={150}
        lineColor={ColorConst.primary}
        lineWidth={2}
        backgroundColor={ColorConst.light}
        showDots={false}
        withCurvedLines={true}
        showXAxisIndices={[0, 2, 4, 6]}
        barSpacing={2}
      />
    ),
    chartDetail: <WeightTrackingChart />,
    route: ROUTE.WEIGHT_TRACKING,
  },
  {
    title: "Temps d'activité",
    subtitle: "",
    chart: <ActivityTimeChart />,
    chartDetail: <ActivityTimeChartDetail />,
    route: ROUTE.ACTIVITY_TIME,
  },
  {
    title: "Nombre de pas",
    subtitle: "Aujourd'hui",
    chart: <NumberOfStepsChart />,
    chartDetail: (
      <NumberOfStepsChart
        size={Dimensions.get("screen").width * 0.65}
        strokeWidth={18}
        labelFontSize={16}
        valueFontSize={32}
      />
    ),
    route: ROUTE.NUMBER_OF_STEPS,
  },
  {
    title: "Charge d'entrainement",
    subtitle: "7 derniers jours",
    chart: <TrainingVolumeChart />,
    route: ROUTE.TRAINING_VOLUME,
  },
];

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
