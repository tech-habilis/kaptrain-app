import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
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
      text: "completeProfile.step3.levelBeginner",
      secondaryText: "completeProfile.step3.levelBeginnerHours",
    },
    {
      text: "completeProfile.step3.levelIntermediate",
      secondaryText: "completeProfile.step3.levelIntermediateHours",
    },
    {
      text: "completeProfile.step3.levelAdvanced",
      secondaryText: "completeProfile.step3.levelAdvancedHours",
    },
    {
      text: "completeProfile.step3.levelConfirmed",
      secondaryText: "completeProfile.step3.levelConfirmedHours",
    },
    {
      text: "completeProfile.step3.levelExpert",
      secondaryText: "completeProfile.step3.levelExpertHours",
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
          completeProfile.step3.title
        </Text>
        <Text className="text-subtleText mt-1">
          completeProfile.step3.description
        </Text>

        <Choices
          data={choices}
          selectedChoice={selectedChoice}
          onChange={setSelectedChoice}
          type="secondary"
          className="mt-8"
        />
      </View>
      <View className="flex-row gap-6 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">
            completeProfile.step3.progress
          </Text>
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
          text="common.continue"
          className="grow"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_4)}
        />
      </View>
    </>
  );
}
