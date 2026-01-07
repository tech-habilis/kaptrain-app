import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button, { ButtonIcon } from "@/components/button";
import {
  ActivityDistributionChartDetail,
  activityDistributionData,
  NumberOfSessionChart,
} from "@/components/home/statistics";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPalette from "@/components/icons/palette";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router } from "expo-router";
import { ReactNode, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcDrag from "@/components/icons/drag";
import Dropdown from "@/components/dropdown";
import DonutChart, { DonutChartItem } from "@/components/charts/donut-chart";
import { ColorConst } from "@/constants/theme";
import { TChoice } from "@/types";

const cognitiveFeelingDistribution: DonutChartItem[] = [
  {
    label: "RPE 1",
    value: 25,
    color: ColorConst.success,
  },
  {
    label: "RPE 6",
    value: 10,
    color: "#FFA915",
  },
  {
    label: "RPE 2",
    value: 5,
    color: "#75D55B",
  },
  {
    label: "RPE 7",
    value: 0,
    color: "#FF8E11",
  },
  {
    label: "RPE 3",
    value: 0,
    color: "#A6D935",
  },
  {
    label: "RPE 8",
    value: 0,
    color: "#FF7314",
  },
  {
    label: "RPE 4",
    value: 25,
    color: "#D6D933",
  },
  {
    label: "RPE 9",
    value: 15,
    color: "#FF5025",
  },
  {
    label: "RPE 5",
    value: 15,
    color: "#FFCB1F",
  },
  {
    label: "RPE 10",
    value: 10,
    color: "#FF2D2D",
  },
];

const CognitiveFeelingChart = () => {
  return (
    <View className="flex-1">
      <View className="px-14 py-2">
        <DonutChart data={cognitiveFeelingDistribution} />
      </View>

      <FlatList
        data={cognitiveFeelingDistribution}
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
            <Text className="text-subtleText">{`${item.label} (${item.value}%)`}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default function ActivityDistribution() {
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  const tabs = ["Semaine", "Mois", "Année"];
  const [tab, setTab] = useState(tabs[0]);

  type DistributionOption = TChoice & {
    chart: ReactNode;
    withPalette: boolean;
  };
  const distributionOptions: DistributionOption[] = [
    {
      text: "Heure",
      withPalette: true,
      chart: <ActivityDistributionChartDetail withDate />,
    },
    {
      text: "Répartition de séance",
      withPalette: false,
      chart: <ActivityDistributionChartDetail />,
    },
    {
      text: "Nombre de séances",
      withPalette: false,
      chart: <NumberOfSessionChart />,
    },
    {
      text: "RPE Cognitif",
      withPalette: false,
      chart: <CognitiveFeelingChart />,
    },
    {
      text: "RPE Physique",
      withPalette: false,
      chart: <CognitiveFeelingChart />,
    },
  ];

  const [selectedDistribution, setSelectedDistribution] =
    useState<DistributionOption>(distributionOptions[0]);

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
        <Dropdown
          label={selectedDistribution.text}
          options={distributionOptions}
          selectedOption={selectedDistribution}
          onSelect={(choice) => {
            const selected = distributionOptions.find(
              (option) => option.text === choice.text,
            );
            if (selected) {
              setSelectedDistribution(selected);
            }
          }}
          className="flex-1 justify-between"
          modalTitle="Trier par"
        />
        {selectedDistribution.withPalette && (
          <ButtonIcon
            size="large"
            onPress={() => bottomSheetModalRef.current?.present()}
          >
            <IcPalette />
          </ButtonIcon>
        )}
      </View>

      <View className="border border-stroke p-4 mt-6 rounded-lg h-101 mx-4">
        {selectedDistribution.chart}
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
                  <Text className="text-base text-secondary flex-1 ml-[2.5px]">
                    {x.label}
                  </Text>

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
