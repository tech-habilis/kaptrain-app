import Button from "@/components/button";
import IcCheckVerified from "@/components/icons/check-verified";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";

export default function EmailVerified() {
  return (
    <ImageBackground
      source={require("../assets/images/mail-verified.png")}
      className="size-full"
    >
      <StatusBar style="light" />
      <View className="py-safe justify-center items-center flex-1 gap-2 mx-4">
        <View className="grow" />

        <IcCheckVerified />
        <Text className="text-white text-2xl font-bold">
          emailVerified.emailVerified
        </Text>
        <Text className="text-white text-base text-center">
          emailVerified.emailVerifiedDescription
        </Text>

        <View className="grow" />

        <Button
          className="w-full mb-6"
          text="emailVerified.completeProfile"
          onPress={() => {
            router.replace(ROUTE.COMPLETE_PROFILE_1);
          }}
        />
      </View>
    </ImageBackground>
  );
}
