import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCard from "@/components/icons/card";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import IcApple from "@/components/icons/apple";
import { Choice } from "@/components/choices";

export default function SubscriptionCheckout() {
  const params = useLocalSearchParams();
  const planType = params.plan as "monthly" | "yearly" | undefined;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card");
  const [saveCard, setSaveCard] = useState(false);

  const price = planType === "yearly" ? "89,99 €" : "8,99 €";
  const billingType = planType === "yearly" ? "Annuelle" : "Mensuelle";
  const nextBillingDate = "14/10/2025";

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Header with Background */}
      <ImageBackground source={require("../assets/images/today-session.png")}>
        <View className="flex-row gap-1 items-center pt-safe pb-6 px-4">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft color="white" />
          </Pressable>
          <Text className="text-lg font-ls-bold text-white flex-1">
            Abonnement premium
          </Text>
        </View>
      </ImageBackground>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Method Selection */}
        <View className="gap-2 mb-6">
          <Text className="text-secondary font-semibold text-base">
            Choisir un moyen de paiement
          </Text>
          <Text className="text-subtleText text-sm mb-2">
            Sélectionne le moyen de paiement qui te correspond le mieux.
          </Text>

          {/* Credit Card Option */}
          <Choice
            type="radio"
            choice={{
              text: "Carte de crédit",
            }}
            selected
            onPress={() => {}}
            className="mt-4"
          />

          {/* Apple Pay Option */}
          <Pressable
            onPress={() => setPaymentMethod("apple")}
            className="flex-row items-center justify-center gap-2 p-4 rounded-lg border border-stroke bg-white"
          >
            <IcApple />
            <Text className="text-secondary font-semibold text-sm">
              Apple Pay
            </Text>
          </Pressable>
        </View>

        {/* Card Input Fields */}
        {paymentMethod === "card" && (
          <View className="gap-6 mb-6">
            <Input label="Nom sur la carte" placeholder="Sophie Dubois" />

            <Input
              label="N° de carte de crédit"
              placeholder="**** **** **** ****"
              rightIcon={<IcCard />}
            />

            <View className="flex-row gap-4">
              <Input
                label="Date d'expiration"
                placeholder="MM/AA"
                className="flex-1"
              />
              <Input
                label="Cryptogramme"
                placeholder="CVC"
                className="flex-1"
              />
            </View>

            {/* Save Card Checkbox */}
            <Pressable
              onPress={() => setSaveCard(!saveCard)}
              className="flex-row items-center gap-2"
            >
              <View
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  saveCard ? "border-primary bg-primary" : "border-stroke"
                }`}
              >
                {saveCard && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-accent text-sm">
                Enregistrer ma carte pour plus tard
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom Summary Section */}
      <View className="bg-light px-4 pt-6 pb-safe border-t border-stroke">
        {/* Trial Period Badge */}
        <Text className="text-secondary font-ls-bold text-xl">
          14 jours d&apos;essai gratuit
        </Text>

        {/* Billing Details */}
        <View className="gap-3 mb-4 mt-4">
          <View className="flex-row justify-between">
            <Text className="text-accent text-sm">Type de facturation</Text>
            <Text className="text-secondary font-semibold text-sm">
              {billingType}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-accent text-sm">Prochain prélèvement</Text>
            <Text className="text-secondary font-semibold text-sm">
              {`${price} le ${nextBillingDate}`}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-accent text-sm">Total aujourd&apos;hui</Text>
            <Text className="text-secondary font-semibold text-sm">0,00 €</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          text="Démarrer l'essai gratuit"
          className="w-full mb-2"
          onPress={() => router.replace(ROUTE.PAYMENT_CONFIRMED)}
        />

        <Text className="text-accent text-xs">
          Sans engagement, annule à tout moment
        </Text>
      </View>
    </View>
  );
}
