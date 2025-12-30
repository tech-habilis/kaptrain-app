import { ReactNode, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SnappySpringConfig,
} from "react-native-reanimated";
import Text from "./text";
import { scheduleOnRN } from "react-native-worklets";
import cn from "@/utilities/cn";

export const Slider = ({
  title,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  value = 0,
  steps = 5,
  onChange,
  className,
  reverseGradient = false,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftIcon: ReactNode;
  rightIcon: ReactNode;
  value?: number;
  steps?: number;
  onChange?: (value: number) => void;
  className?: string;
  reverseGradient?: boolean;
}) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const sliderWidth = useSharedValue(0);
  const translateX = useSharedValue(8);
  const startPosition = useSharedValue(0);

  const handleSliderLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    sliderWidth.value = width;

    // Initialize translateX based on current value
    if (width > 0) {
      if (steps > 1) {
        const stepWidth = (width - 16) / (steps - 1); // 16 = 8px padding on each side
        translateX.value = 8 + value * stepWidth; // Start 8px from left edge
      } else {
        translateX.value = 8; // Single step, position at start
      }
      setIsLayoutReady(true);
    }
  };

  const snapToStep = (position: number): { position: number; step: number } => {
    "worklet";
    if (sliderWidth.value === 0 || steps <= 1) return { position: 8, step: 0 };

    const clampedPosition = Math.max(
      8,
      Math.min(sliderWidth.value - 8, position),
    );
    const stepWidth = (sliderWidth.value - 16) / (steps - 1); // 16 = 8px padding on each side
    const nearestStep = Math.round((clampedPosition - 8) / stepWidth);
    const snappedPosition = 8 + nearestStep * stepWidth;

    return { position: snappedPosition, step: nearestStep };
  };

  const notifyChange = (step: number) => {
    if (onChange && step !== value) {
      onChange(step);
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startPosition.value = translateX.value;
    })
    .onChange((event) => {
      const newPosition = startPosition.value + event.translationX;
      translateX.value = Math.max(
        8,
        Math.min(sliderWidth.value - 8, newPosition),
      );
    })
    .onEnd(() => {
      const snapped = snapToStep(translateX.value);
      translateX.value = withSpring(snapped.position, SnappySpringConfig);
      scheduleOnRN(notifyChange, snapped.step);
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const snapped = snapToStep(event.x);
    translateX.value = withSpring(snapped.position, SnappySpringConfig);
    scheduleOnRN(notifyChange, snapped.step);
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  // NOTE: commented because not needed, but let's keep it for reference
  // Calculate progress percentage for visual display
  // const progress = steps > 1 ? (value / (steps - 1)) * 100 : 0;

  // Animated style for progress bar
  const progressBarStyle = useAnimatedStyle(() => {
    if (sliderWidth.value === 0) return { width: 0, opacity: 0 };
    const width = translateX.value + 12; // extend by thumb radius
    return {
      width: Math.max(0, width),
      opacity: translateX.value > 8 ? 1 : 0,
    };
  });

  // Animated style for thumb
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - 12 }], // offset by thumb radius
    };
  });

  return (
    <View className={className}>
      {/* Labels and Title Row */}
      <View className="relative flex-row items-center justify-between mb-4">
        <Text className="text-xs text-subtleText">{leftLabel}</Text>
        <View className="absolute w-full items-center pointer-events-none">
          <Text className="text-sm text-secondary font-bold">{title}</Text>
        </View>
        <Text className="text-xs text-subtleText">{rightLabel}</Text>
      </View>

      {/* Slider Row */}
      <View className="flex-row items-center gap-2">
        {/* Left Icon */}
        <View>{leftIcon}</View>

        {/* Slider Bar Container */}
        <View className="flex-1">
          <GestureDetector gesture={composedGesture}>
            <Animated.View onLayout={handleSliderLayout}>
              <View className="relative h-4 justify-center">
                {/* Base Track */}
                <View className="absolute w-full h-4 bg-light rounded-full" />

                {/* Step Circles - only render after layout */}
                {isLayoutReady &&
                  Array.from({ length: steps }).map((_, index) => {
                    // Calculate position with 8px padding on each side
                    const width = sliderWidth.value;
                    const effectiveWidth = 100 - (16 / width) * 100; // Account for padding
                    const paddingPercent = (8 / width) * 100;
                    const stepPosition =
                      steps > 1
                        ? paddingPercent +
                          (index / (steps - 1)) * effectiveWidth
                        : 50;

                    return (
                      <View
                        key={index}
                        className="absolute size-4 rounded-full bg-stroke"
                        style={{
                          left: `${stepPosition}%`,
                          marginLeft: -8, // Half of circle width to center it
                        }}
                      />
                    );
                  })}

                {/* Progress Bar with Gradient */}
                <Animated.View
                  className={cn(
                    "absolute h-4 rounded-full bg-linear-to-r",
                    reverseGradient
                      ? "from-primary to-secondary"
                      : "from-secondary to-primary",
                  )}
                  style={progressBarStyle}
                />

                {/* Thumb - only render after layout */}
                {isLayoutReady && (
                  <Animated.View
                    className={cn(
                      "absolute size-6 rounded-full left-0 bg-white border-4",
                      reverseGradient ? "border-secondary" : "border-primary",
                    )}
                    style={[thumbStyle]}
                  />
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Right Icon */}
        <View>{rightIcon}</View>
      </View>
    </View>
  );
};
