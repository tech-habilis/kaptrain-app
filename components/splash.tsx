import { useSession } from "@/contexts/auth-context";
import { SplashScreen } from "expo-router";
import CustomSplash from "./custom-splash";
import { ReactNode, useEffect, useState } from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// SplashScreen.preventAutoHideAsync();

export function SplashScreenController({onFinishRender}: {onFinishRender: ReactNode}) {
  const { isLoadingSession } = useSession();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const [splashComplete, setSplashComplete] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (!isLoadingSession) {
      setTimeout(() => {
        scale.value = withTiming(1.5, { duration: 600 });
        opacity.value = withTiming(
          0.5,
          { duration: 300 },
          (finished) => {
            if (finished) {
              scheduleOnRN(setSplashComplete, true);
            }
          },
        );
      }, 900)
    }
  }, [isLoadingSession, opacity, scale]);

  // SplashScreen.hide();

  return (
    splashComplete ? onFinishRender : (
      <Animated.View
        pointerEvents="none"
        style={animatedStyle}
      >
        <CustomSplash />
      </Animated.View>
    )
  );
}
