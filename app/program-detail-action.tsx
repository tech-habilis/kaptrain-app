import Button from "@/components/button";
import { Chip } from "@/components/chip";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCalendar from "@/components/icons/calendar";
import IcCheck from "@/components/icons/check";
import IcClockRound from "@/components/icons/clock-round";
import IcFire from "@/components/icons/fire";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";

export default function ProgramDetailAction() {
  const isBought = false;
  const data = [
    {
      icon: <IcFire size={32} />,
      text: "Débutant",
    },
    {
      icon: <IcClockRound size={32} />,
      text: "30 à 40 min par séance",
    },
    {
      icon: <IcCalendar size={32} />,
      text: "4 semaines",
    },
    {
      icon: <IcCheck size={32} />,
      text: "3 séances par semaine",
    },
  ];

  return (
    <View className="bg-white flex-1 py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg flex-1">Abdos à la maison</Text>
      </View>

      <Chip text="Programme acheté" className="self-start bg-warmLight mt-2" />

      <Image
        source={require("../assets/images/exercise-example.png")}
        className="rounded-[20px] self-center mt-6"
      />

      <Text className="text-subtleText text-base mt-6">
        Un programme d’abdos à réaliser à la maison pour renforcer vos muscles
        abdominaux et dorsaux, avec des exercices ciblés et adaptés à votre
        niveau. Sur une période de 4 semaines, vous progresserez progressivement
        pour obtenir des résultats visibles.
      </Text>

      <View className="gap-4 mt-6">
        {data.map((x, index) => (
          <View key={index} className="flex flex-row gap-2 items-center">
            {x.icon}
            <Text className="font-medium text-base text-text">{x.text}</Text>
          </View>
        ))}
      </View>

      <View className="grow" />

      <Button
        text={isBought ? "Commencer" : "Acheter"}
        className="mb-6"
        onPress={() => {
          router.push(ROUTE.BUY_EXERCISE);
        }}
      />
    </View>
  );
}
