import Button, { ButtonIcon } from "@/components/button";
import { ActivityDistributionChartDetail } from "@/components/home/statistics";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPalette from "@/components/icons/palette";
import IcUnfoldMore from "@/components/icons/unfold-more";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function ActivityDistribution() {
  const tabs = ['Semaine', 'Mois', 'Année'];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <View className="bg-white flex-1">
      <View className="px-4 bg-light pt-safe pb-4">
        <View className="flex flex-row gap-1 items-center mb-2">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-bold text-lg">Répartition d’activité</Text>
        </View>

        <Tabs tabs={tabs} onSelected={setTab} selected={tab} className="w-full" />
      </View>

      <View className="flex-row gap-2 pt-4 px-4">
        <Button
          text="Répartition par Heure"
          type="secondaryV2"
          className="flex-1 justify-between"
          rightIcon={<IcUnfoldMore />}
        />
        <ButtonIcon size="large">
          <IcPalette />
        </ButtonIcon>
      </View>

      <View className="border border-stroke p-4 mt-6 rounded-lg h-95 mx-4">
        <ActivityDistributionChartDetail />
      </View>
    </View>
  );
}
