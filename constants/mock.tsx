import {
  ActivityDistributionChart,
  TrainingVolumeChart,
} from "@/components/home/statistics";
import { ReactNode } from "react";
import { View } from "react-native";
import { ColorConst } from "./theme";
import Text from "@/components/text";
import CircularProgress from "@/components/charts/circular-progress";
import LineChart from "@/components/charts/line-chart";

export interface StatisticWidget {
  title: string;
  subtitle: string;
  chart: ReactNode;
}

const mockActivityTime = [
  {
    title: "Aujourd’hui",
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

export const mockStatistics: StatisticWidget[] = [
  {
    title: "Répartition d'activité",
    subtitle: "Aujourd'hui",
    chart: <ActivityDistributionChart />,
  },
  {
    title: "Volume d’entrainement",
    subtitle: "7 derniers jours",
    chart: <TrainingVolumeChart withTotal />,
  },
  {
    title: "Suivi de poids",
    subtitle: "01 janvier - 30 juillet",
    chart: (
      <LineChart
        data={[
          { x: "Jan", y: 72 },
          { x: "Fev", y: 71 },
          { x: "Fev", y: 70 },
          { x: "Mar", y: 69 },
          { x: "Mar", y: 68 },
          { x: "Avr", y: 67 },
          { x: "Avr", y: 68 },
        ]}
        height={110}
        minY={60}
        maxY={80}
        lineColor={ColorConst.primary}
        lineWidth={2}
        backgroundColor={ColorConst.light}
        showDots={false}
        withCurvedLines={true}
        showXAxisIndices={[0, 2, 4, 6]}
        barSpacing={2}
      />
    ),
  },
  {
    title: "Temps d’activité",
    subtitle: "",
    chart: (
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
    ),
  },
  {
    title: "Nombre de pas",
    subtitle: "Aujourd'hui",
    chart: (
      <View className="items-center justify-center flex-1">
        <CircularProgress
          current={3500}
          total={5000}
          size={100}
          strokeWidth={8}
          backgroundColor="#F5F6FD"
          progressColor={ColorConst.secondary}
          title="Pas"
        />
      </View>
    ),
  },
  {
    title: "Charge d’entrainement",
    subtitle: "7 derniers jours",
    chart: <TrainingVolumeChart />,
  },
];
