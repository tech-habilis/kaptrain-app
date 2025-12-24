import { ImageBackground, View } from "react-native";
import Text from "@/components/text";
import IcKaptrain from "@/components/icons/kaptrain";
import Button from "@/components/button";
import { useRouter } from "expo-router";
import { ROUTE } from "@/constants/route";
import { appName } from "@/constants/misc";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require("../assets/images/onboarding-0.png")}>
      <View className="w-full h-full pt-25.75 flex">
        <View className="flex-1 flex flex-col items-center">
          <IcKaptrain />
          <Text className="text-white text-[44px] font-bold mb-4 mt-3.5 uppercase">
            {appName}
          </Text>
          <Text className="text-white font-medium">landing.text1</Text>
          <Text className="text-white font-medium">landing.text2</Text>
        </View>

        <View className="mb-safe w-full px-4">
          <Button
            type="secondary"
            text="Connexion"
            className="w-full"
            onPress={() => router.push(ROUTE.SIGN_IN)}
          />
          <Button text="Inscription" className="mt-2 w-full " />
        </View>
      </View>
    </ImageBackground>
  );
}
