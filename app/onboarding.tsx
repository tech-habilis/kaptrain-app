import Button from "@/components/button";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { useSession } from "@/contexts/auth-context";
import { useState } from "react";
import { ImageBackground, View } from "react-native";

const STEPS = [
  {
    imageBg: require("../assets/images/onboarding-1.png"),
    text: "Visualise, comprends,\naméliore.",
    color: ColorConst.tertiary,
  },
  {
    imageBg: require("../assets/images/onboarding-2.png"),
    text: "L’expertise sportive,\naccessible à tous.",
    color: "#69FFA2",
  },
  {
    imageBg: require("../assets/images/onboarding-3.png"),
    text: "Ta progression\ncommence ici.",
    color: ColorConst.primary,
  },
];

export default function Onboarding() {
  const { setFirstOpenTimestamp } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];

  /**
   * This page should only be seen once, when the user is first opening the app.
   * We set the first open timestamp here to indicate that the user has seen this page.
   */
  const handleFinishOnboarding = () => {
    setFirstOpenTimestamp();
  };

  return (
    <ImageBackground source={currentStep.imageBg} className="w-full h-full">
      <View className="flex-1 py-safe flex flex-col justify-end items-start px-4">
        <Text className="text-white text-2xl font-bold">
          {currentStep.text}
        </Text>

        <View className="flex flex-row justify-start gap-2 mt-4">
          {Array.from({ length: STEPS.length }).map((_, index) => (
            <View
              key={index}
              className={"flex-1 h-2 rounded-full"}
              style={{
                backgroundColor:
                currentStepIndex >= index
                    ? currentStep.color
                    : ColorConst.warmLight,
              }}
            />
          ))}
        </View>

        <Button
          text="common.next"
          type="secondary"
          className="w-full my-6"
          onPress={() => {
            if (currentStepIndex === STEPS.length - 1) {
              handleFinishOnboarding();
            } else {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
        />
      </View>
    </ImageBackground>
  );
}
