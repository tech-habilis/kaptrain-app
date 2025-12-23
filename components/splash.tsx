import { useSession } from "@/contexts/auth-context";
import { SplashScreen } from "expo-router";
import CustomSplash from "./custom-splash";
import { useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoadingSession } = useSession();
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    if (!isLoadingSession) {
      setTimeout(() => {
        setShouldHide(true);
      }, 1500);
    }
  }, [isLoadingSession]);

  SplashScreen.hide();

  return (
    <Animated.View
      pointerEvents="none"
      entering={FadeIn}
      exiting={FadeOut}
      style={{ display: shouldHide ? "none" : "flex" }}
    >
      <CustomSplash />
    </Animated.View>
  );
}
