import { View, Pressable, ScrollView } from "react-native";
import Text from "@/components/text";
import { router } from "expo-router";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcClose from "@/components/icons/close";
import IcThreeArrow from "@/components/icons/three-arrow";
import Button from "@/components/button";
import { ActivityTimeChartDetail } from "@/components/home/statistics";

export default function ActivityTime() {
  return (
    <ScrollView className="bg-white flex-1 pb-safe">
      <View className="px-4 bg-light pt-safe pb-4">
        <View className="flex flex-row gap-1 items-center mb-2">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-bold text-lg">Volume d’entrainement</Text>
        </View>
      </View>

      <View className="px-4 mt-6 gap-8">
        <ActivityTimeChartDetail />

        {/* level card */}
        <View className="bg-light p-4 rounded-xl">
          <View className="flex-row justify-between">
            <Text className="bg-white text-text p-2 rounded-sm">
              Niveau actuelle : Avancé
            </Text>
            <IcClose />
          </View>
          <Text className="font-bold text-base text-text w-[80%] mt-4">
            Veux-tu passer au niveau supérieur ?
          </Text>
          <Text className="text-subtleText text-sm mt-2">
            Tu passes plus de temps en entraînement que prévu pour ton niveau de
            pratique sportive actuel.
          </Text>

          <View className="flex-row items-center justify-between mt-4">
            <View>
              <Text className="text-subtleText text-sm">Niveau Avancé</Text>
              <Text className="font-bold text-base text-text">
                5 à 7h / sem
              </Text>
            </View>

            <IcThreeArrow />

            <View className="bg-secondary rounded-md p-2">
              <Text className="text-sm text-white">Niveau Confirmé</Text>
              <Text className="text-base font-semibold text-white">8 à 11h / sem</Text>
            </View>

          </View>

          <Button text="Passer au niveau supérieur" size="small" className="mt-4" />
          <Button text="Garder mon niveau actuel" size="small" type="secondary" className="mt-2" />
        </View>
      </View>
    </ScrollView>
  );
}
