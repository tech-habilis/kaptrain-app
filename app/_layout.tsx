import '../global.css'
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
import { StrictMode } from "react";
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind'

initI18n();

export const unstable_settings = {
  anchor: ROUTE_NAME.TABS,
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StrictMode>
      <SessionProvider>
        <SplashScreenController />
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SafeAreaListener onChange={({ insets }) => {
            Uniwind.updateInsets(insets); // enable className such as p-safe etc.
          }}>
            <RootNavigator />
          </SafeAreaListener>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SessionProvider>
    </StrictMode>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useSession();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* logged in stack */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name={ROUTE_NAME.TABS} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>

      {/* non-loggedin stack */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name={ROUTE_NAME.SIGN_IN} />
      </Stack.Protected>
    </Stack>
  );
}
