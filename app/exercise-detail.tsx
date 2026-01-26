import BottomSheetModal from "@/components/bottom-sheet-modal";
import { Chip } from "@/components/chip";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCrossfit from "@/components/icons/crossfit";
import IcLove from "@/components/icons/love";
import IcLoveFilled from "@/components/icons/love-filled";
import IcMuscular from "@/components/icons/muscular";
import ManMuscleMap from "@/components/man-muscle-map";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import getExercises from "@/constants/mock";
import { router, useLocalSearchParams } from "expo-router";
import { ReactNode, useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcYoga from "@/components/icons/yoga";

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams();
  const exercises = getExercises({ isGridView: false });
  const exercise = exercises.find((exercise) => exercise.id === id);
  const tabs = ["Détails", "Instructions"];
  const [tab, setTab] = useState(tabs[0]);
  const requirementModalRef = useRef<BottomSheetModalType>(null);

  const renderTabContent = () => {
    if (tab === "Détails") {
      return (
        <View className="px-4 mt-6">
          <Text className="text-subtleText text-base">
            Le Gobelet Squat est un exercice de renforcement des jambes et des
            fessiers, réalisé en tenant un kettlebell. Il aide à améliorer la
            posture et la mobilité des hanches.
          </Text>

          <ManMuscleMap className="my-8" />

          <View className="gap-2">
            <Text className="text-subtleText text-base">
              Muscles prioritaires
            </Text>

            <View className="flex-row flex-wrap gap-2">
              <Chip text="Quadriceps" />
              <Chip text="Adducteurs" />
              <Chip text="Ischios" />
            </View>
          </View>

          <View className="gap-2 mt-8">
            <Text className="text-subtleText text-base">
              Muscles secondaires
            </Text>

            <View className="flex-row flex-wrap gap-2">
              <Chip text="Ischios" />
            </View>
          </View>
        </View>
      );
    }

    if (tab === "Instructions") {
      const steps = [
        {
          title: "Étape 1",
          description:
            "Positionnez vos pieds légèrement plus large que vos épaules, pointes légèrement tournées vers l'extérieur",
        },
        {
          title: "Étape 2",
          description:
            "Fixez un point devant vous pour garder une bonne posture et éviter de courber le dos",
        },
        {
          title: "Étape 3",
          description:
            "Fléchissez les hanches et les genoux en même temps sans à-coups tous en agrippant le sol avec vos gros orteils pour fixer vos appuis",
        },
        {
          title: "Étape 4",
          description:
            "Remontez en poussant dans le sol et en contractant vos fessiers",
        },
        {
          title: "Étape 5",
          description:
            "Gardez le kettlebell proche de vous avec les coudes au corps ainsi que le dos fixer pour plus de stabilité",
        },
      ];

      const renderItem = ({ icon, text }: { icon: ReactNode;  text: string}) => {
        return (
          <View className="flex-row items-center gap-2 mt-3">
            {icon}
            <Text>{text}</Text>
          </View>
        );
      }

      return (
        <View className="px-4 mt-6">
          <Pressable className="flex-row gap-3" onPress={() => requirementModalRef.current?.present()}>
            <View className="gap-2 w-1/2">
              <Text>Matériels</Text>
              <IcCrossfit size={24} />
            </View>

            <View className="gap-2 w-1/2">
              <Text>Thématiques</Text>
              <IcMuscular size={24} />
            </View>
          </Pressable>

          <View className="mt-6 gap-4">
            {steps.map((x, index) => (
              <View key={index} className="gap-1">
                <Text className="font-bold text-sm text-secondary">{x.title}</Text>
                <Text className="text-sm text-subtleText">{x.description}</Text>
              </View>
            ))}
          </View>

          <BottomSheetModal
            ref={requirementModalRef}
            name="exercise-requirement-modal"
            snapPoints={["40%"]}
            key="statistic"
            className="pb-safe"
          >
            <Text className="text-sm text-subtleText">Matériels</Text>
            {renderItem({ icon: <IcCrossfit size={24} />, text: "KettleBell" })}

            <Text className="text-sm text-subtleText mt-6">Thématiques</Text>
            {renderItem({ icon: <IcMuscular size={24} />, text: "Force" })}
            {renderItem({ icon: <IcYoga size={24} />, text: "Yoga" })}
          </BottomSheetModal>
        </View>
      );
    }
  };

  return (
    <ScrollView
      className="bg-white flex-1"
      contentContainerClassName="pb-safe-or-16"
    >
      <View className="px-4 bg-light pt-safe pb-4">
        <View className="flex flex-row gap-1 items-center">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-ls-bold text-lg flex-1">
            {exercise?.title || "Exercise detail"}
          </Text>
          {exercise?.isFavorite ? (
            <IcLoveFilled size={24} />
          ) : (
            <IcLove size={24} />
          )}
        </View>

        <Tabs
          tabs={tabs}
          onSelected={setTab}
          selected={tab}
          className="w-full mt-4"
          textClassName="font-semibold"
        />

        <Image
          source={require("../assets/images/exercise-detail-example-1.png")}
          className="self-center rounded-[20px] mt-6"
        />
      </View>

      {renderTabContent()}
    </ScrollView>
  );
}
