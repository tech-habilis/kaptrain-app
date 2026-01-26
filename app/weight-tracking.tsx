import { View, Pressable, ScrollView, FlatList } from "react-native";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router } from "expo-router";
import IcArrowLeft from "@/components/icons/arrow-left";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import AreaChart from "@/components/charts/area-chart";
import { ColorConst } from "@/constants/theme";
import IcPencil from "@/components/icons/pencil";
import Input from "@/components/input";
import DatePicker from "@/components/date-picker";
import { DateType } from "react-native-ui-datepicker";

const today = new Date();

export default function WeightTracking() {
  const addWeightModalRef = useRef<BottomSheetModalType>(null);

  const tabs = ["1M", "6M", "1A", "Tout"];
  const [tab, setTab] = useState(tabs[0]);
  const [date, setDate] = useState<DateType>(today);

  const data = [
    {
      x: "05/01/2026",
      y: 86.5,
    },
    {
      x: "06/01/2026",
      y: 87.5,
    },
    {
      x: "07/01/2026",
      y: 86.5,
    },
    {
      x: "08/01/2026",
      y: 85.8,
    },
    {
      x: "09/01/2026",
      y: 86,
    },
    {
      x: "10/01/2026",
      y: 86,
    },
    {
      x: "11/01/2026",
      y: 87.5,
    },
  ];

  return (
    <>
      <ScrollView className="bg-white flex-1" contentContainerClassName="pb-safe">
        <View className="px-4 bg-light pt-safe pb-4">
          <View className="flex flex-row gap-1 items-center mb-2">
            <Pressable onPress={router.back}>
              <IcArrowLeft />
            </Pressable>
            <Text className="font-ls-bold text-lg">Suivi de poids</Text>
          </View>
        </View>

        <Button
          text="Aujourd’hui"
          type="secondaryV2"
          className="self-end mr-4 mt-4 rounded-lg"
          size="small"
        />

        <View className="border border-stroke m-4 p-4 rounded-lg items-center">
          <View className="flex-row">
            <AreaChart
              height={200}
              minY={0.9 * Math.min(...data.map((item) => item.y))}
              maxY={1.05 * Math.max(...data.map((item) => item.y))}
              lineColor={ColorConst.primary}
              lineWidth={4}
              // fillColor={hexToRgba(ColorConst.primary, 0.15)}
              gradientTopColor={ColorConst.primary}
              gradientBottomColor={ColorConst.light}
              textColor={ColorConst.subtleText}
              data={data}
              withCurvedLines={false}
              showGridLines
              renderXAxisLabel={(x, index) => {
                const isFirstOrLast = index === 0 || index === data.length - 1;
                return isFirstOrLast ? (
                  <Text className="text-subtleText">{x}</Text>
                ) : undefined;
              }}
            />
          </View>

          <Tabs
            tabs={tabs}
            onSelected={setTab}
            selected={tab}
            className="px-4 w-full"
          />
        </View>

        <View className="px-4 gap-3">
          <Text className="text-secondary font-semibold text-base">
            Historique
          </Text>
          <FlatList
            data={data}
            contentContainerClassName="gap-1.5 mb-24"
            renderItem={({ item }) => (
              <View
                className="border border-stroke bg-light p-3 rounded-lg flex-row justify-between items-center"
              >
                <Text className="text-accent text-sm w-1/3">{`${item.y}kg`}</Text>
                <Text className="text-accent text-sm  w-1/3">{item.x}</Text>
                <IcPencil />
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View className="pb-safe absolute bottom-0 left-0 right-0 bg-linear-to-t from-white to-transparent blur-3xl">
        <Button
          text="Ajouter un poids"
          className="mx-4 mt-6 mb-6"
          type="secondary"
          onPress={() => addWeightModalRef.current?.present()}
        />
      </View>

      <BottomSheetModal
        ref={addWeightModalRef}
        name="modifyStep"
        snapPoints={["70%"]}
        key="statistic"
        className="pb-safe"
      >
        <Text className="font-ls-bold text-lg text-secondary">
          Ajoute une nouvelle mesure de poids
        </Text>

        <View className="pt-6 gap-4">
          <Input
            label="Poids"
            placeholder="Poids"
            type="unit"
            unit="kg"
            inputClassName="text-base font-normal"
          />

          <DatePicker
            label="Sélectionner une date"
            selectedDate={date}
            onSelect={(selectedDate) => setDate(selectedDate)}
            maxDate={today}
          />
        </View>

        <View className="grow" />

        <Button text="Ajouter" className="mb-6" />
      </BottomSheetModal>
    </>
  );
}
