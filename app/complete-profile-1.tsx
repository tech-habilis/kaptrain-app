import Button from "@/components/button";
import { Choices, TChoice } from "@/components/choices";
import IcPlus from "@/components/icons/plus";
import IcUser from "@/components/icons/user";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import cn from "@/utilities/cn";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function CompleteProfile1() {
  const genders = [
    { text: "Femme" },
    { text: "Homme" },
    { text: "Non-binaire" },
  ];

  const [selectedGender, setSelectedGender] = useState<TChoice>(genders[0]);

  return (
    <>
      <ScrollView className="py-safe px-4 bg-white flex-1">
        <Text className="text-secondary font-bold text-2xl">
          {"Compléter les dernières\nétapes"}
        </Text>
        <Text className="text-subtleText text-base mt-2">
          Indique tes informations personnelles pour créer ton profil.
        </Text>
        <View className="bg-light mt-8 self-center p-6 rounded-2xl relative">
          <IcUser />

          <View className="absolute bg-primary p-1 -right-2 -bottom-2 rounded-lg items-center justify-center">
            <IcPlus />
          </View>
        </View>

        <View className="gap-6 mt-6">
          <Input label="Prénom" placeholder="Votre prénom" />

          <Input label="Nom" placeholder="Votre nom" />

          <Input label="Date de naissance" placeholder="JJ/MM/AAAA" />

          <View className="mb-28">
            <Text className="text-accent font-medium text-sm">Genre</Text>
            <Choices
              data={[
                {
                  text: "Femme",
                },
                {
                  text: "Homme",
                },
                {
                  text: "Non-binaire",
                },
              ]}
              selectedChoice={selectedGender}
              type="default"
              onChange={(choice) => setSelectedGender(choice)}
            />
          </View>
        </View>
      </ScrollView>
      <View className="flex-row gap-6 h-28 pb-safe items-center justify-between px-4 py-6 bg-white">
        <View className="gap-2 grow">
          <Text className="text-subtleText">Étape 1/5</Text>
          <View className="flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full",
                  index === 0 ? "bg-secondary" : "bg-stroke",
                )}
              />
            ))}
          </View>
        </View>
        <Button
          text="Continuer"
          className="grow h-full"
          onPress={() => router.push(ROUTE.COMPLETE_PROFILE_2)}
        />
      </View>
    </>
  );
}
