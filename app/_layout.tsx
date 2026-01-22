import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { SplashScreenController } from "@/components/splash";
import { SessionProvider, useSession } from "@/contexts/auth-context";
import { ROUTE_NAME } from "@/constants/route";
import { initI18n } from "@/utilities/i18n";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

/**
 * Place all initialization logic here for easier management
 */
const initializeApp = () => {
  initI18n();

  // TODO: add support for iOS
  if (Platform.OS === "android") {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
    });
  }
};

initializeApp();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets); // enable className such as p-safe etc.
          }}
        >
          <GestureHandlerRootView className="flex-1">
            <BottomSheetModalProvider>
              <SplashScreenController onFinishRender={<RootNavigator />} />
              <Toasts />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaListener>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { isFirstOpen, isLoggedIn, showCompleteProfileForm } = useSession();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* logged in stack */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Protected guard={showCompleteProfileForm}>
        <Stack.Screen name={ROUTE_NAME.COMPLETE_PROFILE} />
        </Stack.Protected>

        <Stack.Screen name={ROUTE_NAME.TABS} />
      </Stack.Protected>

      {/* non-loggedin stack */}
      <Stack.Protected guard={!isLoggedIn}>
        {/*{__DEV__ && <Stack.Screen name='design-system' />}*/}

        <Stack.Protected guard={isFirstOpen}>
          <Stack.Screen
            name={ROUTE_NAME.ONBOARDING}
            options={{ animation: "fade" }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!isFirstOpen}>
          <Stack.Screen name={ROUTE_NAME.LANDING} />
          <Stack.Screen name={ROUTE_NAME.SIGN_UP} />
          <Stack.Screen name={ROUTE_NAME.SIGN_IN} />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}
