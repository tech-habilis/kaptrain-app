import Button from "@/components/button";
import IcCheck from "@/components/icons/check";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router, useFocusEffect } from "expo-router";
import { useRef, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  View,
  Text as RawText,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import IcKaptrain from "@/components/icons/kaptrain";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";
import IcFire from "@/components/icons/fire";
import IcStar from "@/components/icons/star";
import IcVerified from "@/components/icons/verified";
import IcRadioSelected from "@/components/icons/radio-selected";
import IcRadio from "@/components/icons/radio";
import IcQuote from "@/components/icons/quote";
import HighlightedText from "@/components/highlighted-text";

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const planRef = useRef<RawBottomSheetModalType>(null);

  useFocusEffect(() => {
    setTimeout(() => {
      planRef.current?.present();
    }, 300);
  });

  return (
    <ImageBackground
      source={require("../assets/images/subscription/subscription-bg.png")}
      className="flex-1"
    >
      <StatusBar style="light" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Background Header */}
        <View className="py-safe">
          {/* Logo Section */}
          <View className="px-4 items-center pt-6 pb-8">
            <View className="flex-row items-center mb-2">
              <IcKaptrain size={40} />
              <Text className="text-white text-2xl font-bold ml-2">
                KAPTRAIN
              </Text>
            </View>
            <Text className="text-white/90 text-sm text-center">
              L&apos;Expertise de haut niveau, accessible à tous
            </Text>
          </View>

          {/* Hero Content */}
          <View className="px-4 gap-6">
            <View className="gap-3">
              <RawText className="text-white text-2xl font-bold">
                Débloque tout ton potentiel avec{" "}
                <HighlightedText className="text-white text-2xl font-bold">
                  Kaptrain Premium
                </HighlightedText>
              </RawText>
              <Text className="text-white/90 text-base">
                Accède à toutes les fonctionnalités pour t&apos;entraîner plus
                intelligemment et progresser plus vite.
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="px-4 mt-8 gap-10">
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/15 rounded-xl items-center justify-center">
                  <IcFire size={28} color="white" />
                </View>
                <View>
                  <Text className="text-white text-2xl font-bold">500+</Text>
                  <Text className="text-white/80 text-sm">
                    Athlètes déjà inscrits
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/15 rounded-xl items-center justify-center">
                  <IcStar />
                </View>
                <View>
                  <Text className="text-white text-2xl font-bold">4,8/5</Text>
                  <Text className="text-white/80 text-sm">
                    Note moyenne sur l&apos;App Store
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/15 rounded-xl items-center justify-center">
                  <IcVerified />
                </View>
                <View>
                  <Text className="text-white text-2xl font-bold">30+</Text>
                  <Text className="text-white/80 text-sm">
                    Coachs certifiés impliqués
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Features List */}
          <View className="gap-3 px-4 mt-8">
            {[
              "Accès illimité à la bibliothèque d'exercices",
              "Statistiques avancées pour suivre tes progrès",
              "Créations de cycles et blocs d'entraînement",
              "Programmes conçus par des coachs certifiés",
              "Planification de séances personnalisés",
            ].map((feature, index) => (
              <View
                key={index}
                className="flex-row items-center gap-2 bg-white/15 rounded-full px-1 py-1 pr-3"
              >
                <View className="size-4.5 bg-primary rounded-full items-center justify-center">
                  <IcCheck size={12} color="white" />
                </View>
                <Text className="text-white text-sm flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Ils soutiennent le projet */}
          <View className="mt-12">
            <Text className="text-white text-base font-bold px-4">
              Ils soutiennent le projet
            </Text>
            <ScrollView
              horizontal
              className="mt-3"
              contentContainerClassName="px-4"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} className="items-center w-34">
                  <Image
                    source={require("../assets/images/subscription-testimony-1.png")}
                    className="rounded-2xl"
                  />
                  <Text className="mt-2 text-white font-bold text-xs text-center">
                    Elodie Clouvel
                  </Text>
                  <Text className="mt-1 text-stroke text-center text-[8px] px-1">
                    Vice-Championne olympique Pentathlon moderne
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Ils parlent de nous */}
          <View className="mt-12">
            <Text className="text-white text-base font-bold px-4">
              Ils parlent de nous
            </Text>
            <ScrollView
              horizontal
              className="mt-3"
              contentContainerClassName="px-4 gap-3"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <View
                  key={index}
                  className="border border-accent rounded-[10px] p-4 gap-4 flex-1"
                >
                  <View className="absolute right-6 top-6">
                    <IcQuote />
                  </View>

                  <View className="flex-row gap-2 items-center">
                    <Image
                      source={require("../assets/images/sample-avatar.png")}
                      className="rounded-2xl"
                    />
                    <View>
                      <Text className="text-white font-bold text-base">
                        Marie Patouillet
                      </Text>
                      <Text className="text-xs text-stroke">
                        Vice-Championne olympique
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-1 text-white text-base w-70">
                    Rorem ipsum dolor sit amet consectetur. Ac quam sem mi nibh
                    volutpat enim pellentesque. Proin iaculis nisl et neque sed
                    fermentum sollicitudin lectus.
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <BottomSheetModal name="plan-ref" ref={planRef} snapPoints={["60%"]}>
        {/* Modal Title */}
        <RawText className="text-secondary text-lg font-bold mb-3">
          <RawText className="text-primary">
            14 jours d&apos;essai gratuit,
          </RawText>{" "}
          puis
        </RawText>

        {/* Plan Selection */}
        <View className="gap-2 mb-4">
          {/* Monthly Plan */}
          <Pressable
            onPress={() => setSelectedPlan("monthly")}
            className={`flex-row items-center justify-between p-3 rounded-lg border-2 ${
              selectedPlan === "monthly"
                ? "border-primary bg-white"
                : "border-stroke bg-white"
            }`}
          >
            <View className="flex-1">
              <Text className="text-secondary font-semibold text-base">
                Mensuel
              </Text>
              <Text className="text-subtleText text-sm mt-1">
                8,99€ / mois (après 14j gratuit)
              </Text>
            </View>
            {selectedPlan === "monthly" ? <IcRadioSelected /> : <IcRadio />}
          </Pressable>

          {/* Yearly Plan */}
          <Pressable
            onPress={() => setSelectedPlan("yearly")}
            className={`flex-row items-center justify-between p-3 rounded-lg border-2 ${
              selectedPlan === "yearly"
                ? "border-primary bg-white"
                : "border-stroke bg-white"
            }`}
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-secondary font-semibold text-base">
                  Annuel
                </Text>
                <View className="bg-success rounded px-2 py-0.5">
                  <Text className="text-white text-xs font-medium">
                    2 mois offerts
                  </Text>
                </View>
              </View>
              <Text className="text-subtleText text-sm">89,99€ / an</Text>
            </View>
            {selectedPlan === "yearly" ? <IcRadioSelected /> : <IcRadio />}
          </Pressable>
        </View>

        {/* CTA Button */}
        <Button
          text="Commencer mon essai gratuit"
          className="w-full mb-2"
          onPress={() => {
            planRef.current?.dismiss();
            router.push(ROUTE.SUBSCRIPTION_CHECKOUT);
          }}
        />

        <Text className="text-accent text-xs">
          Sans engagement, annule à tout moment
        </Text>
      </BottomSheetModal>
    </ImageBackground>
  );
}
