import IcArrowLeft from "@/components/icons/arrow-left";
import IcDrag from "@/components/icons/drag";
import IcInfoCircle from "@/components/icons/info-circle";
import Text from "@/components/text";
import { mockStatistics } from "@/constants/mock";
import { useState } from "react";
import { View } from "react-native";

export default function EditSortStatistics() {
  const total = mockStatistics.length;
  const [current, setCurrent] = useState(mockStatistics.slice(0, total - 2));
  const [unselected, setUnselected] = useState(mockStatistics.slice(total - 2));

  return (
    <View className="py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <IcArrowLeft />
        <Text className="font-bold text-lg">Modifier mes statistiques</Text>
      </View>

      <Text className="text-subtleText mt-2">Glisse et dépose les statistiques que tu veux voir sur ta page d’accueil.</Text>

      <View className="border border-primary border-dashed gap-2 p-2 rounded-lg mt-6 bg-light">
        <Text className="text-base font-semibold mb-2 mt-3">Statistiques principales</Text>
        {current.map((x, index) => (
          <View key={index} className="bg-white rounded-lg p-3 flex-row items-center gap-[2.5px]">
            <IcDrag />
            <Text className="flex-1">{x.title}</Text>
            <IcInfoCircle />
          </View>
        ))}
      </View>

      <View className="gap-2 p-2 mt-6">
        {unselected.map((x, index) => (
          <View key={index} className="bg-white rounded-lg p-3 flex-row items-center gap-[2.5px]">
            <IcDrag />
            <Text className="flex-1">{x.title}</Text>
            <IcInfoCircle />
          </View>
        ))}
      </View>
    </View>
  );
}
