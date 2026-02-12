import Button from "@/components/button";
import { Chip } from "@/components/chip";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcClock from "@/components/icons/clock";
import IcHyrox from "@/components/icons/hyrox";
import IcPencil from "@/components/icons/pencil";
import { SessionCard } from "@/components/session";
import { Slider } from "@/components/slider";
import Text from "@/components/text";
import getExercises from "@/constants/mock";
import { ExerciseItem } from "@/types";
import { clsx } from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const exercises = getExercises({ isGridView: false });
const sessionData: {
  title: string;
  description: string;
  exercises: ExerciseItem[];
  haveNote: boolean;
}[] = [
  {
    title: "Échauffement",
    description:
      "Travail ciblé sur l'endurance aérobie haute.\n\nL Répétitions à 95 % de la VMA :\nL'objectif est de maintenir une allure soutenue sur 400 m avec un temps de passage autour de 1'30. \nVeillez à conserver une bonne technique de course tout au long des répétitions. \n\n→ Récupération passive ou active selon le niveau de fatigue. Adapté aux objectifs de développement du seuil aérobie.",
    exercises: [],
    haveNote: false,
  },
  {
    title: "Hyrox Grand Palais",
    description:
      "Travail ciblé sur l'endurance aérobie haute.\n\nL Répétitions à 95 % de la VMA :\nL'objectif est de maintenir une allure soutenue sur 400 m avec un temps de passage autour de 1'30. \nVeillez à conserver une bonne technique de course tout au long des répétitions. \n\n→ Récupération passive ou active selon le niveau de fatigue. Adapté aux objectifs de développement du seuil aérobie.",
    exercises: exercises,
    haveNote: false,
  },
  {
    title: "Récupération",
    description:
      "Travail ciblé sur l'endurance aérobie haute.\n\nL Répétitions à 95 % de la VMA :\nL'objectif est de maintenir une allure soutenue sur 400 m avec un temps de passage autour de 1'30. \nVeillez à conserver une bonne technique de course tout au long des répétitions. \n\n→ Récupération passive ou active selon le niveau de fatigue. Adapté aux objectifs de développement du seuil aérobie.",
    exercises: exercises,
    haveNote: false,
  },
];

export default function SessionViewPersonal() {
  const { status } = useLocalSearchParams();
  const isDone = status === "done";

  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedSections, setCompletedSections] = useState<{
    [key: number]: boolean;
  }>(
    isDone
      ? {
          0: true,
          1: true,
          2: true,
        }
      : {},
  );

  const [rpePhysique, setRpePhysique] = useState<number>(2);
  const [rpeCognitive, setRpeCognitive] = useState<number>(7);

  const toggleExpanded = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleCompleted = (index: number) => {
    setCompletedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <StatusBar style="auto" />
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-[#F6F7FC] pt-safe pb-4 px-4">
            <View className="flex-row gap-1 items-center ">
              <Pressable onPress={router.back} className="p-2">
                <IcArrowLeft />
              </Pressable>
              <Text className="text-lg font-ls-bold text-secondary flex-1">
                Hyrox Paris Grand palais
              </Text>
              <IcPencil size={24} />
            </View>
          </View>

          {/* Title Section */}
          <View className="px-4 pt-6">
            <View className="flex-row items-center gap-2">
              <IcHyrox />
              <Text className="text-base font-bold text-text flex-1">
                Hyrox
              </Text>

              <Chip text="19/04/2025 - 16h00" className="bg-light" />
            </View>
            <Text
              className={clsx("text-sm text-text italic mt-1", {
                hidden: isDone,
              })}
            >
              Par Enguerrand Aucher
            </Text>
          </View>

          {/* Chart section */}
          <View className={clsx("px-4 mt-6 gap-8", { hidden: !isDone })}>
            <Slider
              title="RPE Physique"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={rpePhysique}
              onChange={setRpePhysique}
              steps={10}
              readOnly
              hideStep
              hideThumb
              gradientClassName="from-green-500 to-yellow-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />

            <Slider
              title="RPE Cognitif"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={rpeCognitive}
              onChange={setRpeCognitive}
              steps={10}
              readOnly
              hideStep
              hideThumb
              gradientClassName="from-green-500 via-yellow-500 to-orange-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />
          </View>

          {/* Session Sections */}
          <View className="gap-2 px-4 mt-4">
            {sessionData.map((section, index) => (
              <SessionCard
                key={index}
                title={section.title}
                isCompleted={completedSections[index] || false}
                onToggleComplete={() => toggleCompleted(index)}
                isExpanded={expandedSections[index] || false}
                onToggleExpand={() => toggleExpanded(index)}
                exercises={section.exercises}
                description={section.description}
                haveNote={section.haveNote}
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="px-4 pb-safe absolute bottom-0 left-0 right-0 flex-row items-center p-4 gap-3 bg-white">
          <View className="p-3">
            <IcClock size={32} />
          </View>
          <Button type="secondary" text="J’ai terminé" className="flex-1" />
        </View>
      </View>
    </>
  );
}
