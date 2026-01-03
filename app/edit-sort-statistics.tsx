import BottomSheetModal from "@/components/bottom-sheet-modal";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcDrag from "@/components/icons/drag";
import IcInfoCircle from "@/components/icons/info-circle";
import Text from "@/components/text";
import { StatisticWidget } from "@/constants/mock";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import Button from "@/components/button";
import { router } from "expo-router";
import { mockStatistics } from "@/components/home/statistics";

export default function EditSortStatistics() {
  const total = mockStatistics.length;
  const [current, setCurrent] = useState(mockStatistics.slice(0, total - 2));
  const [unselected, setUnselected] = useState(mockStatistics.slice(total - 2));
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const [selectedStatistic, setSelectedStatistic] =
    useState<StatisticWidget | null>(null);

  const showModal = (selected: StatisticWidget) => {
    setSelectedStatistic(selected);
    bottomSheetModalRef.current?.present();
  };

  const hideModal = () => {
    setSelectedStatistic(null);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <View className="py-safe px-4 bg-white h-full">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg">Modifier mes statistiques</Text>
      </View>

      <Text className="text-subtleText mt-2">
        Glisse et dépose les statistiques que tu veux voir sur ta page
        d’accueil.
      </Text>

      <View className="border border-primary border-dashed gap-2 p-2 rounded-lg mt-6 bg-light">
        <Text className="text-base font-semibold mb-2 mt-3">
          Statistiques principales
        </Text>
        {current.map((x, index) => (
          <View
            key={index}
            className="bg-white rounded-lg p-3 flex-row items-center gap-[2.5px]"
          >
            <IcDrag />
            <Text className="flex-1">{x.title}</Text>
            <Pressable onPress={() => showModal(x)}>
              <IcInfoCircle />
            </Pressable>
          </View>
        ))}
      </View>

      <View className="gap-2 p-2 mt-6">
        {unselected.map((x, index) => (
          <View
            key={index}
            className="bg-white rounded-lg p-3 flex-row items-center gap-[2.5px]"
          >
            <IcDrag />
            <Text className="flex-1">{x.title}</Text>
            <Pressable onPress={() => showModal(x)}>
              <IcInfoCircle />
            </Pressable>
          </View>
        ))}
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="setting"
        snapPoints={["88%"]}
        key="statistic"
        className="pb-safe"
      >
        {selectedStatistic ? (
          <View>
            <Text className="text-lg font-bold text-secondary">
              {selectedStatistic.title}
            </Text>
            <Text className="text-subtleText text-base">
              {
                "Visualise ta pratique sous tous les angles. Une vue claire pour équilibrer ta routine et suivre ta progression globale"
              }
            </Text>
            <View className="border border-stroke p-4 mt-6 rounded-lg">
              {selectedStatistic.chartDetail ?? selectedStatistic.chart}
            </View>
          </View>
        ) : null}

        <View className="grow" />

        <Button text="Définir comme widget principal" type="secondary" />
      </BottomSheetModal>
    </View>
  );
}
