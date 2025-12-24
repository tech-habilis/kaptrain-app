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
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabaseUtils } from "@/utilities/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

initI18n();

// TODO: add support for iOS
if (Platform.OS === "android") {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
  });
}

export const unstable_settings = {
  anchor: ROUTE_NAME.TABS,
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <SplashScreenController />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets); // enable className such as p-safe etc.
          }}
        >
          <GestureHandlerRootView>
            <RootNavigator />
            <Toasts />
          </GestureHandlerRootView>
        </SafeAreaListener>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { isLoggedIn, setSession } = useSession();

  useEffect(() => {
    if (!isLoggedIn) {
      Linking.parseInitialURLAsync()
        .then(async (url) => {
          const session = await supabaseUtils
            .createSessionFromUrl(url)
            .catch((err) => {
              console.log("failed to create session from url", err);
            });

          if (session) {
            setSession(supabaseUtils.toLocalSession(session));
          }
        })
        .catch((err) => {
          console.log("failed to set session from url", err);
        });
    }
  }, [isLoggedIn, setSession]);

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
        {/*{__DEV__ && <Stack.Screen name='design-system' />}*/}
        <Stack.Screen name={ROUTE_NAME.LANDING} />
        <Stack.Screen name={ROUTE_NAME.SIGN_IN} />
      </Stack.Protected>
    </Stack>
  );
}
