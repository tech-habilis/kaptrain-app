import IcArrowLeft from "@/components/icons/arrow-left";
import IcCheck from "@/components/icons/check";
import Text from "@/components/text";
import { programs } from "@/constants/mock";
import { ROUTE } from "@/constants/route";
import { ProgramItem } from "@/types";
import { router } from "expo-router";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";

const ProgramCard = ({ program }: { program: ProgramItem }) => {
  return (
    <Pressable onPress={() => router.push(ROUTE.PROGRAM_DETAIL_ACTION)}>
      <ImageBackground source={program.image} className="rounded-xl">
        <View className="p-3 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-sm font-bold">
              {program.title}
            </Text>
            <Text className="text-white text-xs mb-1">{`Créé par ${program.createdBy}`}</Text>
            {program.isBought ? (
              <View className="flex-row items-center gap-1">
                <Text className="text-white text-xs font-medium">Acheté</Text>
                <IcCheck color="white" size={16} />
              </View>
            ) : (
              <Text className="text-white text-xs font-medium">
                {program.price}
              </Text>
            )}
            <View className="flex-row gap-2 mt-2">
              {program.chips.map((chip, index) => (
                <View
                  key={index}
                  className="bg-white py-0.5 px-1 rounded-sm flex-row items-center justify-between"
                >
                  {chip.icon}
                  <Text className="text-text text-xs">{chip.text}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="rotate-180 mr-2">
            <IcArrowLeft color="white" size={24} />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default function ProgramDetail() {
  return (
    <ScrollView
      className="bg-white flex-1 pt-safe px-4"
      contentContainerClassName="pb-24"
    >
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg flex-1">Programmation</Text>
      </View>

      <Text className="text-subtleText text-base mt-1">
        Des programmations sans date de fin conçues par des coachs certifiés.
        Les séances se glissent dans ton agenda semaine après semaine.
      </Text>

      <View className="mt-6 gap-2">
        {programs[0].programs.map((x, index) => (
          <ProgramCard key={index} program={x} />
        ))}
      </View>
    </ScrollView>
  );
}
