import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Slider } from "@/components/slider";


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

export default function SessionEvaluation() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [generalFeeling, setGeneralFeeling] = useState<number>(0);
  const [physicalRPE, setPhysicalRPE] = useState<number>(0);
  const [cognitiveRPE, setCognitiveRPE] = useState<number>(0);
  const [technicalRPE, setTechnicalRPE] = useState<number>(0);
  const [sessionNotes, setSessionNotes] = useState<string>("");

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: Submit evaluation data
      router.back();
    }
  };

  const handleSkip = () => {
    router.back();
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="gap-3">
            <Slider
              title="Ressenti général"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={generalFeeling}
              onChange={setGeneralFeeling}
              steps={10}
              hideStep
              thumbClassName="border-green-500"
              gradientClassName="from-green-500 via-yellow-500 to-orange-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />
          </View>
        );

      case 2:
        return (
          <View className="gap-3">
            <Slider
              title="RPE Physique"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={physicalRPE}
              onChange={setPhysicalRPE}
              steps={10}
              hideStep
              thumbClassName="border-green-500"
              gradientClassName="from-green-500 via-yellow-500 to-orange-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />
          </View>
        );

      case 3:
        return (
          <View className="gap-3">
            <Slider
              title="RPE Cognitif"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={cognitiveRPE}
              onChange={setCognitiveRPE}
              steps={10}
              hideStep
              thumbClassName="border-green-500"
              gradientClassName="from-green-500 via-yellow-500 to-orange-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />
          </View>
        );

      case 4:
        return (
          <View className="gap-3">
            <Slider
              title="RPE Technique"
              leftLabel="Aucun effort"
              rightLabel="Effort maximal"
              value={technicalRPE}
              onChange={setTechnicalRPE}
              steps={10}
              hideStep
              thumbClassName="border-green-500"
              gradientClassName="from-green-500 via-yellow-500 to-orange-500"
              baseClassName="bg-linear-to-r from-green-500 via-yellow-500 to-orange-500 opacity-30"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="gap-1">
          {/* Back button and Title */}
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={router.back}
              className="size-10 items-center justify-center"
            >
              <IcArrowLeft color={ColorConst.secondary} />
            </Pressable>
            <Text className="text-lg font-bold text-secondary flex-1">
              Évaluer la séance
            </Text>
          </View>

          {/* Description */}
          <Text className="text-base text-subtleText leading-tight">
            Indique comment tu as vécu ta séance.
          </Text>
        </View>

        {/* Stepper */}
        <Stepper current={currentStep} total={4} />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {getStepContent()}

        <View className="gap-2 mt-8">
          <Text className="text-accent font-medium text-sm">
            Comment s&apos;est passée ta séance ?
          </Text>
          <View className="border border-stroke rounded-lg bg-white">
            <TextInput
              className="px-4 py-4 text-base text-text min-h-32"
              placeholder="Partage ici tes ressentis, douleurs, détails sur ta séance."
              placeholderTextColor={ColorConst.subtleText}
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              textAlignVertical="top"
              style={{ opacity: sessionNotes ? 1 : 0.4 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe gap-2">
        <Button
          text={currentStep === 4 ? "Valider" : "Suivant"}
          type="primary"
          size="large"
          onPress={handleNext}
        />
        <Button
          text="Remplir plus tard"
          type="tertiary"
          size="large"
          onPress={handleSkip}
        />
      </View>
    </View>
  );
}
