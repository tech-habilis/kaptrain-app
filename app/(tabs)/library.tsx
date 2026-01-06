import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcClock from "@/components/icons/clock";
import IcLightning from "@/components/icons/lightning";
import IcLove from "@/components/icons/love";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { hexToRgba } from "@/utilities/cn";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";

export default function Library() {
  const tabs = ["Exercices", "Programmes"];
  const [tab, setTab] = useState(tabs[0]);

  const menu = [
    {
      title: "Tous les exercices",
      icon: (
        <View className="rotate-180">
          <IcArrowLeft />
        </View>
      ),
      bgColor: "#FFFFFF",
      borderColor: ColorConst.text,
      onPress: () => {
        router.push(ROUTE.EXERCISE_LIST);
      },
    },
    {
      title: "Exercices favoris",
      icon: <IcLove />,
      bgColor: hexToRgba(ColorConst.tertiary, 0.1),
      borderColor: ColorConst.tertiary,
      onPress: () => {},
    },
    {
      title: "Mes sports",
      icon: <IcLightning size={24} color={ColorConst.primary} />,
      bgColor: ColorConst.light,
      borderColor: ColorConst.primary,
      onPress: () => {},
    },
  ];

  const categories = [
    {
      title: "Échauffement",
      description:
        "Prépare ton corps à l’effort avec des routines ciblées, haut et bas du corps.",
      image: require("../../assets/images/library-category-1.png"),
    },
    {
      title: "Handisport",
      description:
        "Des séances adaptées pour tous les profils, avec une approche inclusive et performante.",
      image: require("../../assets/images/library-category-2.png"),
    },
    {
      title: "Prévention blessures",
      description:
        "Renforce les zones sensibles et améliore tes points faibles pour durer dans le temps",
      image: require("../../assets/images/library-category-3.png"),
    },
    {
      title: "Maternité",
      description:
        "Adapte ton suivi et tes séances à chaque étape de la grossesse ou du post-partum.",
      image: require("../../assets/images/library-category-4.png"),
    },
    {
      title: "Core-training",
      description:
        "Boost ta sangle abdominale et ton gainage pour un meilleur équilibre et plus de puissance",
      image: require("../../assets/images/library-category-5.png"),
    },
    {
      title: "Mobilité",
      description:
        "Travaille ta souplesse, ta fluidité et ton amplitude pour des mouvements plus libres et efficaces",
      image: require("../../assets/images/library-category-6.png"),
    },
  ];

  return (
    <ScrollView className="pt-safe bg-white">
      <StatusBar style="auto" />

      <View className="px-4">
        <Text className="font-bold text-lg text-secondary">Bibliothèque</Text>
        <Text className="text-subtleText text-base mt-1">
          Choisis les exercices et les programmes qui t’aideront à atteindre tes
          objectifs
        </Text>

        <Tabs
          tabs={tabs}
          onSelected={setTab}
          selected={tab}
          className="w-full my-4"
          textClassName="font-semibold"
        />
      </View>

      <ImageBackground source={require("../../assets/images/library-bg-1.png")}>
        <View className="px-4 py-3 flex-row gap-4 items-center">
          <View className="gap-2 w-30">
            <Text className="text-text text-lg font-bold">
              Prêt pour mes séances du jour ?
            </Text>
            <View className="bg-white py-0.5 px-1 rounded-sm flex-row items-center justify-between">
              <Text className="text-text text-xs">Fin dans 14h32</Text>
              <IcClock />
            </View>
          </View>

          <ScrollView horizontal contentContainerClassName="gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="bg-white p-3 rounded-xl border border-stroke"
              >
                <Text className="font-bold text-sm">
                  {"Ma séance\nrenforcement"}
                </Text>
                <Text className="text-subtleText">Gratuit</Text>

                <Button
                  text="Générer ma séance"
                  type="secondary"
                  size="small"
                  className="mt-2"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>

      <ScrollView horizontal contentContainerClassName="gap-2 m-4">
        {menu.map((x, index) => (
          <Pressable
            key={index}
            className="gap-2 p-3 border rounded-xl items-start w-31"
            style={{ backgroundColor: x.bgColor, borderColor: x.borderColor }}
            onPress={x.onPress}
          >
            {x.icon}
            <Text className="text-text font-bold text-base">{x.title}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* categories */}
      <View className="gap-2 px-4 mb-6">
        {categories.map((x, index) => (
          <ImageBackground key={index} source={x.image} className="rounded-2xl">
            <View className="p-3 pt-8">
              <Text className="text-white font-semibold text-base">
                {x.title}
              </Text>
              <Text className="text-white mt-1.5">{x.description}</Text>
            </View>
          </ImageBackground>
        ))}
      </View>
    </ScrollView>
  );
}
