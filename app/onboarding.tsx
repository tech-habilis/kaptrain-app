import { AnimatedImageBackground, AnimatedText } from "@/components/animated";
import Button from "@/components/button";
import { ColorConst } from "@/constants/theme";
import { useSession } from "@/contexts/auth-context";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  SlideInLeft,
  SlideOutRight,
  SnappySpringConfig,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const STEPS = [
  {
    imageBg: require("../assets/images/onboarding-1.png"),
    text: "onboarding.step1Text",
    color: ColorConst.tertiary,
  },
  {
    imageBg: require("../assets/images/onboarding-2.png"),
    text: "onboarding.step2Text",
    color: "#69FFA2",
  },
  {
    imageBg: require("../assets/images/onboarding-3.png"),
    text: "onboarding.step3Text",
    color: ColorConst.primary,
  },
];

const PaginationItem = ({
  index,
  currentIndex,
  nextIndex,
}: {
  index: number;
  currentIndex: number;
  nextIndex: number;
}) => {
  const isActive = currentIndex >= index;

  return (
    <Animated.View
      className="flex-1 h-2 rounded-full"
      // style={bgStyle}
      style={{
        backgroundColor: isActive ? STEPS[currentIndex].color : ColorConst.warmLight,
      }}
      key={`${isActive ? "active" : "inactive"}-${index}`}
    />
  );
};

const PaginationImage = ({ index, currentIndex }: { index: number; currentIndex: number }) => {
  const { width: screenWidth } = useWindowDimensions();
  const translateXValue = useDerivedValue(() => {
    return withSpring((index - currentIndex) * screenWidth, SnappySpringConfig);
  });

  const translateX = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });

  return (
    <AnimatedImageBackground
      key={"image" + index}
      source={STEPS[index].imageBg}
      className="absolute inset-0"
      style={translateX}
      // style={{
      //   transform: [{ translateX: -currentIndex * screenWidth }],
      // }}
    />
  );
};

export default function Onboarding() {
  const { setFirstOpenTimestamp } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const nextStepIndex = (currentStepIndex + 1) % STEPS.length;
  const currentStep = STEPS[currentStepIndex];

  /**
   * This page should only be seen once, when the user is first opening the app.
   * We set the first open timestamp here to indicate that the user has seen this page.
   */
  const handleFinishOnboarding = () => {
    setFirstOpenTimestamp();
  };

  return (
    <Animated.View className="flex-1 py-safe flex flex-col justify-end items-start px-4">
      {STEPS.map((step, index) => (
        <PaginationImage key={"image" + index} index={index} currentIndex={currentStepIndex} />
      ))}
      <AnimatedText
        className="text-white text-2xl font-ls-bold"
        key={"text" + currentStepIndex}
        entering={currentStepIndex === 0 ? undefined : SlideInLeft}
        exiting={SlideOutRight}
      >
        {currentStep.text}
      </AnimatedText>

      <Animated.View className="flex flex-row justify-start gap-2 mt-4">
        {Array.from({ length: STEPS.length }).map((_, index) => (
          <PaginationItem
            key={index}
            index={index}
            currentIndex={currentStepIndex}
            nextIndex={nextStepIndex}
          />
        ))}
      </Animated.View>

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
    </Animated.View>
  );
}
