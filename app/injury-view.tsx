import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import IcPencil from "@/components/icons/pencil";
import ManMuscleMap from "@/components/man-muscle-map";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";

export default function InjuryView() {
  const injury = {
    title: "Déchirure Épaule Droite",
    status: "En cours",
    statusColor: ColorConst.warmLight,
    date: "30/03/2025",
    description:
      "Déchirure musculaire à l'épaule droite survenue pendant une séance de musculation. Douleur présente sur certains mouvements de poussée et d'élévation. En cours de rééducation.",
    area: "Épaule droite",
  };

  const handleEdit = () => {
    router.push(ROUTE.EDIT_INJURY);
  };

  const handleMarkAsHealed = () => {
    console.log("Mark injury as healed");
  };

  return (
    <BasicScreen
      title={injury.title}
      rightIcon={<IcPencil size={24} />}
      onRightIconPress={handleEdit}
    >
      <ScrollView className="flex-1">
        {/* Status and Date */}
        <View className="px-4 pt-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
              <Text
                className="text-text text-sm py-0.5 px-2 rounded"
                style={{ backgroundColor: injury.statusColor }}
              >
                {injury.status}
              </Text>
            </View>
            <Text className="text-subtleText text-sm">
              {`Depuis le ${injury.date}`}
            </Text>
          </View>

          {/* Description */}
          <Text className="text-text text-base leading-7 mb-6">
            {injury.description}
          </Text>
        </View>

        {/* ManMuscleMap Section */}
        <View className="items-center gap-6">
          <ManMuscleMap />
          <View className="items-center">
            <Text className="text-subtleText text-sm">
              Zone de la blessure
            </Text>
            <Text className="text-text text-base font-semibold mt-2">
              {injury.area}
            </Text>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* CTA Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-white">
        <Button
          text="Ma blessure est soignée"
          type="secondary"
          onPress={handleMarkAsHealed}
        />
      </View>
    </BasicScreen>
  );
}