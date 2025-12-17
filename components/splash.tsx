import { useSession } from "@/contexts/auth-context";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoadingSession } = useSession();

  if (!isLoadingSession) {
    SplashScreen.hide();
  }

  return null;
}
