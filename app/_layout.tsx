import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import "../global.css"

import { SplashScreenController } from "@/components/splash"
import { ROUTE_NAME } from "@/constants/route"
import { SessionProvider, useSession } from "@/contexts/auth-context"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { initI18n } from "@/utilities/i18n"
import { Toasts } from "@backpackapp-io/react-native-toast"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useFonts } from "expo-font"
import { Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaListener } from "react-native-safe-area-context"
import { Uniwind } from "uniwind"

/**
 * Place all initialization logic here for easier management
 */
const initializeApp = () => {
  initI18n()

  // TODO: add support for iOS
  if (Platform.OS === "android") {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
    })
  }
}

initializeApp()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    // LeagueSpartan fonts
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    "LeagueSpartan-SemiBold": require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    "LeagueSpartan-ExtraBold": require("../assets/fonts/LeagueSpartan-ExtraBold.ttf"),

    // Inter fonts
    "Inter_18pt-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter_18pt-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter_18pt-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter_18pt-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets) // enable className such as p-safe etc.
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
  )
}

function RootNavigator() {
  const { isFirstOpen, isLoggedIn, showCompleteProfileForm, showWellness } =
    useSession()

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
        <Stack.Protected guard={!showCompleteProfileForm && showWellness}>
          <Stack.Screen name={ROUTE_NAME.WELLNESS} />
        </Stack.Protected>
        <Stack.Protected guard={!showCompleteProfileForm && !showWellness}>
          <Stack.Screen name={ROUTE_NAME.TABS} />
        </Stack.Protected>
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
  )
}
