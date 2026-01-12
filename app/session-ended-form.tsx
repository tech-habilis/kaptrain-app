import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import CircularProgress from "@/components/charts/circular-progress";

const Stepper = ({ current, total }: { current: number; total: number }) => {
  return (
    <View className="flex-row gap-2 py-4">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`flex-1 h-2 rounded-full ${
            index < current ? "bg-secondary" : "bg-light"
          }`}
        />
      ))}
    </View>
  );
};

export default function SessionEndedForm() {
  const [duration, setDuration] = useState<number>(30);
  const maxDuration = 240; // 4 hours max

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="gap-1">
          {/* Back button and Title */}
          <View className="flex-row items-center gap-1">
            <Pressable onPress={router.back} className="size-10 items-center justify-center">
              <IcArrowLeft color={ColorConst.secondary} />
            </Pressable>
            <Text className="text-lg font-bold text-secondary flex-1">
              Remplir la durée de séance
            </Text>
          </View>

          {/* Description */}
          <Text className="text-base text-subtleText leading-tight">
            Plus tu es précis, plus tes données sont fiables pour analyser tes
            efforts au fil du temps.
          </Text>
        </View>

        {/* Stepper */}
        <Stepper current={1} total={2} />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="justify-start items-center mt-6 flex-1">
          <CircularProgress
            current={duration}
            total={maxDuration}
            title="min"
            onChange={setDuration}
            size={280}
            strokeWidth={20}
            valueFontSize={48}
            labelFontSize={48}
            progressColor={ColorConst.primary}
            textContainerClassName="flex-row-reverse gap-2"
            labelClassName="text-secondary font-bold"
            valueClassName="text-secondary font-bold"
          />
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe gap-2">
        <Button
          text="Suivant"
          type="primary"
          size="large"
          onPress={() => {
            router.push(ROUTE.SESSION_EVALUATION);
          }}
        />
        <Button
          text="Remplir plus tard"
          type="tertiary"
          size="large"
          onPress={() => {
            // Skip the form and go back
            router.back();
          }}
        />
      </View>
    </View>
  );
}