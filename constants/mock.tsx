import {
  ActivityDistributionChart,
  TrainingVolumeChart,
} from "@/components/home/statistics";
import { ReactNode } from "react";
import { View } from "react-native";
import { ColorConst } from "./theme";
import Text from "@/components/text";

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
    chart: <TrainingVolumeChart />,
  },
  {
    title: "Suivi de poids",
    subtitle: "01 janvier - 30 juillet",
    chart: <ActivityDistributionChart />,
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
    subtitle: "Aujourd’hui",
    chart: <ActivityDistributionChart />,
  },
  {
    title: "Charge d’entrainement",
    subtitle: "7 derniers jours",
    chart: <TrainingVolumeChart />,
  },
];
