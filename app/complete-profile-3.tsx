import Button from "@/components/button";
import { Choices, TChoice } from "@/components/choices";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { cn } from "tailwind-variants";

export default function CompleteProfile3() {
  const choices: TChoice[] = [
    {
      text: "Débutant",
      secondaryText: "1 à 2h par semaine",
    },
    {
      text: "Intermédiaire",
      secondaryText: "3 à 4h par semaine",
    },
    {
      text: "Avancé",
      secondaryText: "5 à 7h par semaine",
    },
    {
      text: "Confirmé",
      secondaryText: "8 à 11h par semaine",
    },
    {
      text: "Expert",
      secondaryText: "+ de 12 par semaine",
    },
  ];

  const [selectedChoice, setSelectedChoice] = useState<TChoice>(choices[0]);

  return (
    <>
      <View className="py-safe px-4 flex-1 bg-white">
        <StatusBar style="dark" />
        <Pressable className="py-4" onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="text-2xl text-secondary font-bold mt-2">
          {"Choisir mon niveau de\npratique sportive"}
        </Text>
        <Text className="text-subtleText mt-1">
          {
            "Afin de te proposer des programmes\nadaptés à ton niveau d'entraînement."
          }
        </Text>

        <Choices
          data={choices}
          selectedChoice={selectedChoice}
          onChange={setSelectedChoice}
          type="secondary"
          className="mt-8"
        />
      </View>
      <View className="flex-row gap-6 h-28 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">Étape 3/5</Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index <= 2 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
        <Button
          text="Continuer"
          className="grow h-full"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_4)}
        />
      </View>
    </>
  );
}
