import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCheckbox from "@/components/icons/checkbox";
import IcClock from "@/components/icons/clock";
import IcInfoCircle from "@/components/icons/info-circle";
import IcLightning from "@/components/icons/lightning";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";

const SessionCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <View className="p-3 gap-3 border border-stroke rounded-xl">
      <View className="flex-row gap-2 items-center">
        <IcCheckbox />
        <Text className="text-base font-semibold flex-1">{title}</Text>
        <View className="-rotate-90">
          <IcArrowLeft />
        </View>
      </View>
      <Text className="text-subtleText">{description}</Text>
    </View>
  );
};

export default function TodaySession() {
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
  return (
    <>
      <ScrollView className="bg-white" contentContainerClassName="pb-24">
        <ImageBackground source={require("../assets/images/today-session.png")}>
          <View className="flex flex-row gap-1 items-center pt-safe pb-6 px-4">
            <Pressable onPress={router.back} className="p-2">
              <IcArrowLeft color="white" />
            </Pressable>
            <Text className="text-lg font-bold text-white flex-1">
              Séance du jour
            </Text>
            <IcInfoCircle size={24} color="white" />
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
            />
          ))}
        </View>
      </ScrollView>
      <View className="px-4 pb-safe absolute bottom-0 left-0 right-0 flex-row items-center p-4 gap-3">
        <View className="p-3">
          <IcClock size={32} />
        </View>
        <Button type="secondary" text="J’ai terminé" className="flex-1" />
      </View>
    </>
  );
}
