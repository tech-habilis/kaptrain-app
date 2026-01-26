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
      <View className="w-full h-full pt-25.75 flex pb-safe">
        <View className="flex-1 flex flex-col items-center">
          <IcKaptrain />
          <Text className="text-white text-[44px] font-ls-extrabold mb-4 mt-3.5 uppercase">
            {appName}
          </Text>
          <Text className="text-white font-medium">L'Expertise de haut niveau,</Text>
          <Text className="text-white font-medium">accessible à tous</Text>
        </View>

        <View className="mb-safe font-inter-medium w-full px-4">
          <Button
            type="secondary"
            text="Connexion"
            className="w-full"
            onPress={() => router.push(ROUTE.SIGN_IN)}
          />
          <Button
            text="Inscription"
            className="my-2 w-full "
            onPress={() => {
              // setStorageItemAsync(STORAGE_KEY.FIRST_OPEN_TIMESTAMP, null);
              // setStorageItemAsync(STORAGE_KEY.PROFILE_COMPLETED_AT, null);
              router.push(ROUTE.SIGN_UP);
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
