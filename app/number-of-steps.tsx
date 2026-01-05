import { View, Pressable, Dimensions } from "react-native";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { router, useFocusEffect } from "expo-router";
import IcArrowLeft from "@/components/icons/arrow-left";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import { NumberOfStepsChart } from "@/components/home/statistics";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import IcSync from "@/components/icons/sync";
import BarChart from "@/components/charts/bar-chart";

export default function NumberOfSteps() {
  const modifyStepModalRef = useRef<BottomSheetModalType>(null);
  const healthConnectSyncModalRef = useRef<BottomSheetModalType>(null);

  const tabs = ["Aujourd’hui", "Semaine", "Mois"];
  const [tab, setTab] = useState(tabs[0]);

  const [current, setCurrent] = useState(8416);
  const TARGET_STEPS = 10000;

  const renderTabContent = () => {
    if (tab === "Aujourd’hui") {
      return (
        <>
          <View className="flex-row items-center justify-center gap-3">
            <Pressable>
              <IcArrowLeft size={16} />
            </Pressable>
            <Text className="text-base text-secondary">Aujourd’hui</Text>
            <Pressable className="rotate-180">
              <IcArrowLeft size={16} />
            </Pressable>
          </View>
          <View className="flex-row flex-1">
            <NumberOfStepsChart
              current={current}
              size={180}
              strokeWidth={18}
              labelFontSize={16}
              valueFontSize={32}
              progressColor={current >= TARGET_STEPS ? ColorConst.primary : undefined}
            />
          </View>
        </>
      );
    }

    if (tab === "Semaine") {
      const getBarColor = (value: number) => {
        if (value >= TARGET_STEPS) return ColorConst.primary;
        return undefined;
      };

      return (
        <>
          <View className="flex-row items-center justify-center gap-3">
            <Pressable>
              <IcArrowLeft size={16} />
            </Pressable>
            <Text className="text-base text-secondary">
              Du 14 avril au 20 avril
            </Text>
            <Pressable className="rotate-180">
              <IcArrowLeft size={16} />
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center">
            <BarChart
              defaultBarColor={ColorConst.secondary}
              withBarLabel
              targetY={TARGET_STEPS}
              data={[
                { x: "D", y: 6230, color: getBarColor(6230) },
                { x: "L", y: 3617, color: getBarColor(3617) },
                { x: "M", y: 10089, color: getBarColor(10089) },
                { x: "M", y: 18200, color: getBarColor(18200) },
                { x: "J", y: 11368, color: getBarColor(11368) },
                { x: "V", y: 9120, color: getBarColor(9120) },
                { x: "Auj", y: 7416, color: getBarColor(7416) },
              ]}
            />
          </View>
        </>
      );
    }

    if (tab === "Mois") {
      // Mock data for April 2024 using real dates
      const monthData = [
        { date: new Date(2024, 3, 1), steps: 8500 },
        { date: new Date(2024, 3, 2), steps: 11200 },
        { date: new Date(2024, 3, 3), steps: 9800 },
        { date: new Date(2024, 3, 4), steps: 12500 },
        { date: new Date(2024, 3, 5), steps: 7200 },
        { date: new Date(2024, 3, 6), steps: 9000 },
        { date: new Date(2024, 3, 7), steps: 10500 },
        { date: new Date(2024, 3, 8), steps: 8900 },
        { date: new Date(2024, 3, 9), steps: 11800 },
        { date: new Date(2024, 3, 10), steps: 9500 },
        { date: new Date(2024, 3, 11), steps: 10200 },
        { date: new Date(2024, 3, 12), steps: 13000 },
        { date: new Date(2024, 3, 13), steps: 8100 },
        { date: new Date(2024, 3, 14), steps: 6230 },
        { date: new Date(2024, 3, 15), steps: 3617 },
        { date: new Date(2024, 3, 16), steps: 10089 },
        { date: new Date(2024, 3, 17), steps: 18200 },
        { date: new Date(2024, 3, 18), steps: 11368 },
        { date: new Date(2024, 3, 19), steps: 9120 },
        { date: new Date(2024, 3, 20), steps: 7416 },
        { date: new Date(2024, 3, 21), steps: 10800 },
        { date: new Date(2024, 3, 22), steps: 9200 },
        { date: new Date(2024, 3, 23), steps: 11500 },
        { date: new Date(2024, 3, 24), steps: 8700 },
        { date: new Date(2024, 3, 25), steps: 12100 },
        { date: new Date(2024, 3, 26), steps: 9900 },
        { date: new Date(2024, 3, 27), steps: 10300 },
        { date: new Date(2024, 3, 28), steps: 11700 },
        { date: new Date(2024, 3, 29), steps: 9400 },
        { date: new Date(2024, 3, 30), steps: 10600 },
      ];

      const dayInitials = ["L", "M", "M", "J", "V", "S", "D"];

      // Get first day of month (0 = Monday, 6 = Sunday)
      const firstDate = monthData[0]?.date;
      const firstDayOfWeek = firstDate ? (firstDate.getDay() + 6) % 7 : 0; // Convert Sunday=0 to Monday=0

      // Create array with empty slots for days before the 1st
      const calendarDays = Array(firstDayOfWeek).fill(null);
      monthData.forEach((data) => calendarDays.push(data));

      // Split into weeks
      const weeks = [];
      for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
      }

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

          <View className="flex-1 px-2 pt-4 items-center justify-center">
            {/* Day headers */}
            <View className="flex-row gap-3 mb-3">
              {dayInitials.map((initial, index) => (
                <View key={index} className="size-8 items-center justify-center">
                  <Text className="text-sm font-medium text-subtleText">
                    {initial}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row gap-3 mb-3">
                {week.map((dayData, dayIndex) => {
                  if (!dayData) {
                    return <View key={dayIndex} className="size-8" />;
                  }

                  const isAboveTarget = dayData.steps >= TARGET_STEPS;
                  return (
                    <View
                      key={dayIndex}
                      className={cn(
                        "size-8 rounded items-center justify-center",
                        isAboveTarget ? "bg-primary" : "bg-light"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-sm font-bold",
                          isAboveTarget ? "text-white" : "text-black"
                        )}
                      >
                        {dayData.date.getDate()}
                      </Text>
                    </View>
                  );
                })}
                {/* Fill empty slots at end of week */}
                {week.length < 7 &&
                  Array(7 - week.length)
                    .fill(null)
                    .map((_, index) => (
                      <View key={`empty-${index}`} className="size-8" />
                    ))}
              </View>
            ))}
          </View>
        </>
      );
    }

    return null;
  };

  useFocusEffect(() => {
    setTimeout(() => {
      healthConnectSyncModalRef.current?.present();
    }, 3_000);
  });

  return (
    <View className="bg-white flex-1 pb-safe">
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

      <View className="border border-stroke m-4 p-4 h-85 rounded-lg">
        {renderTabContent()}
      </View>

      <Text className="px-4 font-medium text-sm mt-6">
        Objectif de pas aujourd’hui
      </Text>
      <View className="border border-stroke mx-4 p-4 mt-2 rounded-lg">
        <View className="flex-row">
          <Text className="font-bold text-secondary text-base">
            {current.toString()}
          </Text>
          <Text className="font-medium text-subtleText text-base">
            {` / ${TARGET_STEPS} pas`}
          </Text>
        </View>

        <View className="bg-light rounded-full mt-1.5 w-full">
          <View
            className={cn(
              "h-3 rounded-full",
              current >= TARGET_STEPS ? "bg-primary" : "bg-secondary",
            )}
            style={{
              width: `${(current / TARGET_STEPS) * 100}%`,
            }}
          />
        </View>
      </View>

      <View className="grow" />

      <Button
        text="Modifier mon objectif"
        className="mx-4 mb-6"
        type="secondary"
        onPress={() => modifyStepModalRef.current?.present()}
      />

      <BottomSheetModal
        ref={modifyStepModalRef}
        name="modifyStep"
        snapPoints={["70%"]}
        key="statistic"
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          {"Indiquer mon objectif de pas\nquotidien"}
        </Text>

        <View className="flex-row pt-6">
          <NumberOfStepsChart
            current={current}
            size={Dimensions.get("screen").width * 0.75}
            strokeWidth={18}
            labelFontSize={16}
            valueFontSize={32}
            progressColor={ColorConst.primary}
          />
        </View>

        <View className="grow" />

        <Button text="Valider" className="mb-6" />
      </BottomSheetModal>

      <BottomSheetModal
        ref={healthConnectSyncModalRef}
        name="healthConnectSync"
        snapPoints={["70%"]}
        key="statistic"
        className="pb-safe"
      >
        <IcSync />
        <Text className="font-bold text-lg text-secondary mt-3">
          {"Synchroniser avec Health\nConnect"}
        </Text>

        <Text className="mt-1 text-base">
          {
            "KapTrain accède à vos données de santé (nombre de pas) via Health Connect afin de vous aider à suivre vos activités physiques.\n\nCes données sont utilisées exclusivement pour votre suivi personnel dans l’application. Elles ne sont jamais partagées ni revendues à des tiers.\n\nEn poursuivant, vous acceptez que KapTrain accède à vos données de pas, conformément à notre politique de confidentialité."
          }
        </Text>

        <View className="grow" />

        <Button text="J’ai lu et j’accepte" className="mb-6" />
      </BottomSheetModal>
    </View>
  );
}
