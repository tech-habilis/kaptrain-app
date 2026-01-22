import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcPlus from "@/components/icons/plus";
import IcUser from "@/components/icons/user";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import cn from "@/utilities/cn";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function CompleteProfile1() {
  const genders = [
    { text: "completeProfile.step1.genderFemale" },
    { text: "completeProfile.step1.genderMale" },
    { text: "completeProfile.step1.genderNonBinary" },
  ];

  const [selectedGender, setSelectedGender] = useState<TChoice>(genders[0]);

  return (
    <>
      <ScrollView className="py-safe px-4 bg-white flex-1">
        <Text className="text-secondary font-bold text-2xl">
          completeProfile.step1.title
        </Text>
        <Text className="text-subtleText text-base mt-2">
          completeProfile.step1.description
        </Text>
        <View className="bg-light mt-8 self-center p-6 rounded-2xl relative">
          <IcUser />

          <View className="absolute bg-primary p-1 -right-2 -bottom-2 rounded-lg items-center justify-center">
            <IcPlus />
          </View>
        </View>

        <View className="gap-6 mt-6">
          <Input
            label="completeProfile.step1.firstName"
            placeholder="completeProfile.step1.firstNamePlaceholder"
          />

          <Input
            label="completeProfile.step1.lastName"
            placeholder="completeProfile.step1.lastNamePlaceholder"
          />

          <Input
            label="completeProfile.step1.birthDate"
            placeholder="completeProfile.step1.birthDatePlaceholder"
          />

          <View className="mb-28">
            <Text className="text-accent font-medium text-sm">
              completeProfile.step1.gender
            </Text>
            <Choices
              data={[
                {
                  text: "completeProfile.step1.genderFemale",
                },
                {
                  text: "completeProfile.step1.genderMale",
                },
                {
                  text: "completeProfile.step1.genderNonBinary",
                },
              ]}
              selectedChoice={selectedGender}
              type="default"
              onChange={(choice) => setSelectedGender(choice)}
            />
          </View>
        </View>
      </ScrollView>
      <View className="flex-row gap-6 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">
            completeProfile.step1.progress
          </Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index === 0 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
        <Button
          text="common.continue"
          className="grow"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_2)}
        />
      </View>
    </>
  );
}
