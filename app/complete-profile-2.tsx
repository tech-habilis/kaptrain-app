import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, View } from "react-native";
import { cn } from "tailwind-variants";

export default function CompleteProfile2() {
  return (
    <>
      <View className="py-safe px-4 flex-1 bg-white">
        <StatusBar style="dark" />
        <Pressable className="py-4" onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="text-2xl text-secondary font-bold mt-2">
          completeProfile.step2.title
        </Text>
        <Text className="text-subtleText mt-1">
          completeProfile.step2.description
        </Text>

        <Input
          label="completeProfile.step2.currentWeight"
          className="mt-8"
          placeholder="00.00"
          type="unit"
          unit="kg"
        />
        <Button
          text="completeProfile.step2.preferNotToAnswer"
          type="secondary"
          className="rounded-lg mt-3"
        />
      </View>
      <View className="flex-row gap-6 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">completeProfile.step2.progress</Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index <= 1 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
        <Button
          text="common.continue"
          className="grow"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_3)}
        />
      </View>
    </>
  );
}
