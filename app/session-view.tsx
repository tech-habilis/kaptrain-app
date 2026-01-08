import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCheck from "@/components/icons/check";
import IcClock from "@/components/icons/clock";
import IcInfoCircle from "@/components/icons/info-circle";
import IcLightning from "@/components/icons/lightning";
import { SessionCard } from "@/components/session/session-card";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { clsx } from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";

export default function SessionView() {
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedCards, setCompletedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const totalWeek = 4;
  const currentWeek = 1;

  const sessionData = [
    {
      title: "Réveille ton corps en douceur",
      description:
        "Réveille ton corps en douceur.\n\nEnchaîne 3 minutes de cardio léger (corde à sauter, jumping jacks) suivi de 2 minutes de mobilité (cercles de hanches, montées de genoux dynamiques).",
    },
    {
      title: "Bloc principal - 20x20 - 12 minutes",
      description:
        "20 secondes à fond / 20 secondes de récupération x 18 rounds\n\nAlterne les exercices suivants en boucle :\n\nBurpees\n\nMountain climbers\n\nJump squats\n\nHigh knees\n\nPush-ups\n\nSkater jumps\n\nRépète cette série 3 fois avec 1 minute de pause entre chaque round complet.",
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleCompleted = (index: number) => {
    setCompletedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <ScrollView className="bg-white" contentContainerClassName="pb-24">
        <ImageBackground source={require("../assets/images/today-session.png")}>
          <View className="pt-safe pb-6 px-4">
            <View className="flex-row gap-1 items-center ">
              <Pressable onPress={router.back} className="p-2">
                <IcArrowLeft color="white" />
              </Pressable>
              <Text className="text-lg font-bold text-white flex-1">
                Séance du jour
              </Text>
              <IcInfoCircle size={24} color="white" />
            </View>
            <View className="flex-row items-center justify-center mt-6">
              {Array.from({ length: totalWeek }).map((_, i) => (
                <View key={i} className="flex-row items-center">
                  <View className="bg-white items-center justify-center w-18.5 h-14 rounded-lg border-4 border-tertiary">
                    <Text className="text-[10px] font-bold text-text">
                      {i < currentWeek ? "S" + (i + 1) : "Semaine"}
                    </Text>
                    {i < currentWeek ? (
                      <IcCheck size={24} color={ColorConst.text} />
                    ) : (
                      <Text className="text-2xl font-bold text-text">
                        {(i + 1).toString()}
                      </Text>
                    )}
                  </View>

                  <View
                    className={clsx("h-1 w-4 bg-red-300", {
                      hidden: i === totalWeek - 1,
                    })}
                  />
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>

        <View className="px-4 pt-6">
          <View className="flex-row items-center gap-1.5">
            <IcLightning size={24} color={ColorConst.tertiary} />
            <Text className="text-base font-bold">
              HIIT 20x20 – Puissance & Résistance
            </Text>
          </View>
          <Text className="text-sm text-text mt-1">
            Séance du jour - Environ 25 minutes
          </Text>
        </View>

        <View className="gap-2 px-4 mt-4">
          {sessionData.map((session, index) => (
            <SessionCard
              key={index}
              title={session.title}
              description={session.description}
              isCompleted={completedCards[index] || false}
              onToggleComplete={() => toggleCompleted(index)}
              isExpanded={expandedCards[index] || false}
              onToggleExpand={() => toggleExpanded(index)}
              exercises={[]}
            />
          ))}
        </View>
      </ScrollView>
      <View className="px-4 pb-safe absolute bottom-0 left-0 right-0 flex-row items-center p-4 gap-3 bg-white">
        <View className="p-3">
          <IcClock size={32} />
        </View>
        <Button type="secondary" text="J’ai terminé" className="flex-1" />
      </View>
    </>
  );
}
