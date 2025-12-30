import IcCheckVerified from "@/components/icons/check-verified";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import Text from "@/components/text";
import Button from "@/components/button";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";

export default function ProfileCompleted() {
  const { setProfileCompleted } = useSession();

  return (
    <ImageBackground
      source={require("../assets/images/mail-verified.png")}
      className="size-full"
    >
      <StatusBar style="light" />
      <View className="py-safe justify-center items-center flex-1 gap-2 mx-4">
        <View className="grow" />

        <IcCheckVerified />
        <Text className="text-white text-2xl font-bold">profileCompleted.title</Text>
        <Text className="text-white text-base text-center">
          profileCompleted.description
        </Text>

        <View className="grow" />

        <Button
          className="w-full mb-6"
          text="profileCompleted.explore"
          onPress={() => {
            setProfileCompleted();
            router.replace(ROUTE.TABS);
          }}
        />
      </View>
    </ImageBackground>
  );
}
