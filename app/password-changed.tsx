import Button from "@/components/button";
import IcCheckVerified from "@/components/icons/check-verified";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";

export default function PasswordChanged() {
  const { setSession } = useSession();

  return (
    <ImageBackground
      source={require("../assets/images/mail-verified.png")}
      className="size-full"
    >
      <StatusBar style="light" />
      <View className="py-safe justify-center items-center flex-1 gap-2 mx-4">
        <View className="grow" />

        <IcCheckVerified />
        <Text className="text-white text-2xl font-bold text-center">
          passwordChanged.title
        </Text>
        <Text className="text-white text-base text-center">
          passwordChanged.description
        </Text>

        <View className="grow" />

        <Button
          className="w-full mb-6"
          text="signIn.signIn"
          onPress={() => {
            setSession({
              accessToken: "MOCK_ACCESS_TOKEN",
              refreshToken: "MOCK_REFRESH_TOKEN",
              user: {
                id: "MOCK_USER_ID",
                email: "MOCK_EMAIL",
                name: "MOCK_NAME",
                avatarUrl: null,
              },
            });

            router.replace(ROUTE.ROOT);
          }}
        />
      </View>
    </ImageBackground>
  );
}
