import Button from "@/components/button";
import { Chip } from "@/components/chip";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcBasketball from "@/components/icons/basketball";
import IcBodybuilding from "@/components/icons/bodybuilding";
import IcClose from "@/components/icons/close";
import IcCrossfit from "@/components/icons/crossfit";
import IcCycling from "@/components/icons/cycling";
import IcRowing from "@/components/icons/rowing";
import IcSearch from "@/components/icons/search";
import IcYoga from "@/components/icons/yoga";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, View, Text as RawText } from "react-native";
import { cn } from "tailwind-variants";
import { useTranslation } from "react-i18next";

export default function CompleteProfile4() {
  const { t } = useTranslation();
  const choices: TChoice[] = [
    {
      text: "sports.athletics",
      leftIcon: <IcCycling />,
    },
    {
      text: "sports.rowing",
      leftIcon: <IcRowing />,
    },
    {
      text: "sports.basketball",
      leftIcon: <IcBasketball />,
    },
    {
      text: "sports.crossfit",
      leftIcon: <IcCrossfit />,
    },
    {
      text: "sports.cycling",
      leftIcon: <IcCycling />,
    },
    {
      text: "sports.bodybuilding",
      leftIcon: <IcBodybuilding />,
    },
    {
      text: "sports.yoga",
      leftIcon: <IcYoga />,
    },
  ];

  const [selectedChoices, setSelectedChoices] = useState<TChoice[]>([
    choices[0],
  ]);

  const [search, setSearch] = useState<string>("");

  const clearSearch = () => {
    setSearch("");
    // TODO: blur input when search is cleared
    // currently cannot do this because cannot access ref from Input component
  };

  return (
    <>
      <View className="py-safe px-4 flex-1 bg-white">
        <StatusBar style="dark" />
        <Pressable className="py-4" onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="text-2xl text-secondary font-bold mt-2">
          completeProfile.step4.title
        </Text>
        <Text className="text-subtleText mt-1">
          completeProfile.step4.description
        </Text>

        <View
          className={cn("flex-row flex-wrap gap-2", {
            "mt-6": selectedChoices.length > 0,
          })}
        >
          {selectedChoices.map((choice, index) => (
            <Chip
              key={index}
              text={choice.text}
              type="selected"
              onLeftSidePress={() => {
                setSelectedChoices(
                  selectedChoices.filter((c) => c.text !== choice.text),
                );
              }}
            />
          ))}
        </View>

        <RawText className="text-subtleText mt-2">
          {selectedChoices.length.toString()}{" "}
          {t("completeProfile.step4.selected")}{" "}
          {selectedChoices.length === 5
            ? t("completeProfile.step4.limitReached")
            : null}
        </RawText>

        <View className="flex-row gap-4 mt-6 items-center">
          <Input
            leftIcon={<IcSearch size={16} />}
            className="flex-1"
            value={search}
            onChangeText={setSearch}
          />
          <Pressable onPress={clearSearch}>
            <IcClose color={ColorConst.accent} />
          </Pressable>
        </View>

        <ScrollView className="mt-4">
          <Choices
            data={choices}
            type="multipleChoice"
            selectedChoices={selectedChoices}
            onChangeMultiple={setSelectedChoices}
            maxChoice={5}
          />
        </ScrollView>
      </View>
      <View className="flex-row gap-6 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">
            completeProfile.step4.progress
          </Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index <= 3 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
        <Button
          text="common.continue"
          className="grow"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_5)}
        />
      </View>
    </>
  );
}
