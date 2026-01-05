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
  const total = 10000;

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
              progressColor={current >= total ? ColorConst.primary : undefined}
            />
          </View>
        </>
      );
    }

    if (tab === "Semaine") {
      const getBarColor = (value: number) => {
        if (value >= 10000) return ColorConst.primary;
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
              targetY={10_000}
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
            {` / ${total} pas`}
          </Text>
        </View>

        <View className="bg-light rounded-full mt-1.5 w-full">
          <View
            className={cn(
              "h-3 rounded-full",
              current >= total ? "bg-primary" : "bg-secondary",
            )}
            style={{
              width: `${(current / total) * 100}%`,
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
