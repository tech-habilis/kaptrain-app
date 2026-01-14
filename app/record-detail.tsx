import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import ChooseSubSport from "@/components/choose-sub-sport";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function RecordDetailScreen() {
  const params = useLocalSearchParams();
  const sportId = (params.sport as string) || "musculation";
  return (
    <BasicScreen title="Mes records" headerClassName="bg-light">
      <View className="px-4 flex-1">
        <ChooseSubSport sportId={sportId} />;
      </View>

      {/* CTA with gradient overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-safe pt-8 bg-linear-to-t from-white via-white to-transparent">
        <Button
          type="secondary"
          text="Ajouter un record"
          onPress={() => console.log("Add record")}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  );
}
