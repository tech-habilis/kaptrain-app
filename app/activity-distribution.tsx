import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button, { ButtonIcon } from "@/components/button";
import {
  ActivityDistributionChartDetail,
  activityDistributionData,
} from "@/components/home/statistics";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPalette from "@/components/icons/palette";
import IcUnfoldMore from "@/components/icons/unfold-more";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcDrag from "@/components/icons/drag";

export default function ActivityDistribution() {
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  const tabs = ["Semaine", "Mois", "Année"];
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

        <Tabs
          tabs={tabs}
          onSelected={setTab}
          selected={tab}
          className="w-full"
        />
      </View>

      <View className="flex-row gap-2 pt-4 px-4">
        <Button
          text="Répartition par Heure"
          type="secondaryV2"
          className="flex-1 justify-between"
          rightIcon={<IcUnfoldMore />}
        />
        <ButtonIcon
          size="large"
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <IcPalette />
        </ButtonIcon>
      </View>

      <View className="border border-stroke p-4 mt-6 rounded-lg h-95 mx-4">
        <ActivityDistributionChartDetail />
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="setting"
        snapPoints={["88%"]}
        key="statistic"
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">Code couleur</Text>
        <Text className="text-base text-subtleText mt-1">
          Associe une couleur à chaque sport pour mieux visualiser ta pratique
        </Text>

        <View className="gap-2 mt-6">
          {activityDistributionData.map((x, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center justify-between gap-2"
              >
                <View className="border border-stroke rounded-lg p-3 flex-1 flex-row items-center">
                  {x.icon !== undefined && x.icon}
                  <Text className="text-base text-secondary flex-1 ml-[2.5px]">{x.label}</Text>

                  <IcDrag />
                </View>
                <View
                  className="size-12 rounded-lg bg-primary"
                  style={{ backgroundColor: x.color }}
                />
              </View>
            );
          })}
        </View>

        <View className="grow" />

        <Button text="Enregistrer mes modifications" className="mb-6" />
      </BottomSheetModal>
    </View>
  );
}
