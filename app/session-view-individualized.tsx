import Button, { ButtonIcon } from "@/components/button";
import { Chip } from "@/components/chip";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcChat from "@/components/icons/chat";
import IcClock from "@/components/icons/clock";
import IcFile from "@/components/icons/file";
import IcHyrox from "@/components/icons/hyrox";
import IcPencil from "@/components/icons/pencil";
import { SessionCard } from "@/components/session";
import Text from "@/components/text";
import getExercises from "@/constants/mock";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { ExerciseItem } from "@/types";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const exercises = getExercises({ isGridView: false });

export default function SessionViewIndividualized() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedSections, setCompletedSections] = useState<{
    [key: number]: boolean;
  }>({});

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
      exercises: exercises,
      haveNote: true,
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
              <Text className="text-lg font-bold text-secondary flex-1">
                Séance du jour
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

              <Chip text="19/04/2025" className="bg-light" />
            </View>
            <Text className="text-sm text-text italic mt-1">
              Par Enguerrand Aucher
            </Text>
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
        <View className="absolute bottom-0 left-0 right-0 gap-3">
          <ButtonIcon size="large" type="primary" className="self-end mr-4">
            <IcChat />
          </ButtonIcon>

          <View className="px-4 pb-safe  flex-row items-center p-4 gap-3 bg-white">
            <View className="flex-row items-center gap-3">
              <View className="p-3">
                <IcClock size={32} />
              </View>
              <Pressable
                className="p-3"
                onPress={() => router.push(ROUTE.NOTE_HISTORY)}
              >
                <IcFile size={32} color={ColorConst.accent} />
              </Pressable>
            </View>
            <Button type="secondary" text="J’ai terminé" className="flex-1" />
          </View>
        </View>
      </View>
    </>
  );
}
