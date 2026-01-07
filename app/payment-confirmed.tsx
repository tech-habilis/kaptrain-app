import Button from "@/components/button";
import IcCheckVerified from "@/components/icons/check-verified";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";

export default function PaymentConfirmed() {
  return (
    <ImageBackground
      source={require("../assets/images/mail-verified.png")}
      className="size-full"
    >
      <StatusBar style="light" />
      <View className="py-safe justify-center items-center flex-1 gap-2 mx-4">
        <View className="grow" />

        <IcCheckVerified />
        <Text className="text-white text-2xl font-bold">Paiement confirmé</Text>
        <Text className="text-white text-base text-center">
          Ton programme est maintenant débloqué et prêt à être suivi.
        </Text>

        <View className="grow" />

        <Button
          text="Retour à l’accueil"
          type="secondary"
          className="w-full"
          onPress={() => router.replace(ROUTE.ROOT)}
        />
        <Button
          text="Voir mon programme"
          className="w-full"
          onPress={() => router.replace(ROUTE.PROGRAM_DETAIL)}
        />
      </View>
    </ImageBackground>
  );
}
