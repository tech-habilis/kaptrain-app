import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { cn } from "tailwind-variants";

export default function CompleteProfile5() {
  const [invitationCode, setInvitationCode] = useState<string>("");

  return (
    <>
      <View className="py-safe px-4 flex-1 bg-white">
        <StatusBar style="dark" />
        <Pressable className="py-4" onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="text-2xl text-secondary font-bold mt-2">
          completeProfile.step5.title
        </Text>
        <Text className="text-subtleText mt-1">
          completeProfile.step5.description
        </Text>

        <Input
          label="completeProfile.step5.invitationCode"
          placeholder="EX : JNKMD701"
          value={invitationCode}
          onChangeText={(text) => {
            const updatedCode = text.toUpperCase();
            setInvitationCode(updatedCode);
          }}
          className="mt-16"
        />

        <Button
          text="completeProfile.step5.connectToCoach"
          className="mt-4"
          disabled={invitationCode.length === 0}
        />

        <Button
          text="completeProfile.step5.continueWithoutCoach"
          type="tertiary"
          onPress={() => {
            router.dismissAll();
            router.replace(ROUTE.PROFILE_COMPLETED);
          }}
        />
      </View>
      <View className="flex-row gap-6 h-28 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">completeProfile.step5.progress</Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index <= 4 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
