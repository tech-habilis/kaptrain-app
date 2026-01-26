import { View, Pressable } from "react-native";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router } from "expo-router";
import IcArrowLeft from "@/components/icons/arrow-left";
import { useState } from "react";
import BarChart, { BarChartItem } from "@/components/charts/bar-chart";

export default function TrainingVolume() {
  const tabs = ["Semaine", "Mois", "Année"];
  const [tab, setTab] = useState(tabs[0]);

  const renderTabContent = () => {
    if (tab === "Année") {
      const data2025: BarChartItem[] = [
        { x: "Jan", y: 170 },
        { x: "Fev", y: 40 },
        { x: "Mar", y: 140 },
        { x: "Avr", y: 0 },
        { x: "Mai", y: 90 },
        { x: "Juin", y: 200 },
      ];

      return (
        <>
          <View className="flex-row items-center justify-center gap-3">
            <Pressable>
              <IcArrowLeft size={16} />
            </Pressable>
            <Text className="text-base text-secondary">2025</Text>
            <Pressable className="rotate-180">
              <IcArrowLeft size={16} />
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center">
            <BarChart
              showGridLines
              showYAxis
              data={data2025}
              renderYAxisLabel={(value, index) => {
                const hour = Math.floor(value / 60);
                const minute = Math.floor(value % 60);
                return `${hour}h${minute < 10 ? "0" : ""}${minute}`;
              }}
            />
          </View>
        </>
      );
    }

    if (tab === "Semaine") {
      const dataWeek: BarChartItem[] = [
        { x: "D", y: 160 },
        { x: "L", y: 40 },
        { x: "M", y: 140 },
        { x: "M", y: 0 },
        { x: "J", y: 90 },
        { x: "V", y: 200 },
        { x: "Auj", y: 0 },
      ];

      return (
        <>
          <View className="flex-1 items-center justify-center">
            <BarChart
              showGridLines
              showYAxis
              data={dataWeek}
              renderYAxisLabel={(value, index) => {
                const hour = Math.floor(value / 60);
                const minute = Math.floor(value % 60);
                return `${hour}h${minute < 10 ? "0" : ""}${minute}`;
              }}
            />
          </View>
        </>
      );
    }

    if (tab === "Mois") {
      const dataApril: BarChartItem[] = [
        { x: "1", y: 170 },
        { x: "2", y: 40 },
        { x: "3", y: 140 },
        { x: "4", y: 0 },
        { x: "5", y: 90 },
        { x: "6", y: 130 },
        { x: "7", y: 0 },
        { x: "8", y: 60 },
        { x: "9", y: 0 },
      ];

      return (
        <>
          <View className="flex-row items-center justify-center gap-3">
            <Pressable>
              <IcArrowLeft size={16} />
            </Pressable>
            <Text className="text-base text-secondary">Avril</Text>
            <Pressable className="rotate-180">
              <IcArrowLeft size={16} />
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center">
            <BarChart
              showGridLines
              showYAxis
              data={dataApril}
              renderYAxisLabel={(value, index) => {
                const hour = Math.floor(value / 60);
                const minute = Math.floor(value % 60);
                return `${hour}h${minute < 10 ? "0" : ""}${minute}`;
              }}
            />
          </View>
        </>
      );
    }
  };

  return (
    <View className="bg-white flex-1 pb-safe">
      <View className="px-4 bg-light pt-safe pb-4">
        <View className="flex flex-row gap-1 items-center mb-2">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-ls-bold text-lg">Volume d’entrainement</Text>
        </View>

        <Tabs
          tabs={tabs}
          onSelected={setTab}
          selected={tab}
          className="w-full"
        />
      </View>

      <View className="border border-stroke m-4 p-4 h-85 rounded-lg">
        {renderTabContent()}
      </View>
    </View>
  );
}
