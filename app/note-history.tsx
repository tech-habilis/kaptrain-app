import IcArrowLeft from "@/components/icons/arrow-left";
import SessionNoteCard from "@/components/session-note-card";
import Text from "@/components/text";
import { SessionNoteCardProps } from "@/types";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const sessionNotes: SessionNoteCardProps[] = [
  {
    sessionTitle: "Hyrox Grand Palais",
    date: "19/04/2025",
    notes: [
      {
        title: "Échauffement",
        date: "19/04/2025",
        text: "Un peu de raideur au début, mais ça s’est bien amélioré après quelques minutes",
      },
      {
        title: "Étirements",
        date: "19/04/2025",
        text: "J’étais épuisé à la fin, mais satisfait de ma performance, surtout sur le sled push",
      },
    ],
  },
  {
    sessionTitle: "Hyrox Sprint",
    date: "19/04/2025",
    notes: [
      {
        title: "Échauffement",
        date: "19/04/2025",
        text: "Un peu de raideur au début, mais ça s’est bien amélioré après quelques minutes",
      },
      {
        title: "Étirements",
        date: "19/04/2025",
        text: "J’étais épuisé à la fin, mais satisfait de ma performance, surtout sur le sled push",
      },
    ],
  },
  {
    sessionTitle: "Séance Hyrox du 2 mai 2025",
    date: "19/04/2025",
    notes: [
      {
        title: "Échauffement",
        date: "19/04/2025",
        text: "Un peu de raideur au début, mais ça s’est bien amélioré après quelques minutes",
      },
      {
        title: "Étirements",
        date: "19/04/2025",
        text: "J’étais épuisé à la fin, mais satisfait de ma performance, surtout sur le sled push",
      },
    ],
  },
  {
    sessionTitle: "Endurance Hyrox",
    date: "19/04/2025",
    notes: [
      {
        title: "Échauffement",
        date: "19/04/2025",
        text: "Un peu de raideur au début, mais ça s’est bien amélioré après quelques minutes",
      },
      {
        title: "Étirements",
        date: "19/04/2025",
        text: "J’étais épuisé à la fin, mais satisfait de ma performance, surtout sur le sled push",
      },
    ],
  },
  {
    sessionTitle: "Hyrox Max Effort",
    date: "19/04/2025",
    notes: [
      {
        title: "Échauffement",
        date: "19/04/2025",
        text: "Un peu de raideur au début, mais ça s’est bien amélioré après quelques minutes",
      },
      {
        title: "Étirements",
        date: "19/04/2025",
        text: "J’étais épuisé à la fin, mais satisfait de ma performance, surtout sur le sled push",
      },
    ],
  },
];

export default function NoteHistory() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpanded = (index: number) => {
    collapseAll();
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  return (
    <>
      <StatusBar style="auto" />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-[#F6F7FC] pt-safe pb-4 px-4">
          <View className="flex-row gap-1 items-center ">
            <Pressable onPress={router.back} className="p-2">
              <IcArrowLeft />
            </Pressable>
            <Text className="text-lg font-ls-bold text-secondary flex-1">
              Historique de mes notes
            </Text>
          </View>

          <Text className="text-accent text-base">
            Retrouve ici toutes tes notes pour chaque séance de ce sport.
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Session Sections */}
          <View className="gap-2 px-4 mt-4">
            {sessionNotes.map((session, index) => (
              <SessionNoteCard
                key={index}
                {...session}
                isExpanded={expandedSections[index] || false}
                onToggleExpand={() => toggleExpanded(index)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
