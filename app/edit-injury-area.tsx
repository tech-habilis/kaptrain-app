import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import InjuryArea from "@/components/injury-area";
import { TChoice } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function EditInjuryArea() {
  const [selectedInjury, setSelectedInjury] = useState<TChoice | undefined>();

  const handleValidate = () => {
    // TODO: Pass the selected injury back to the previous screen
    console.log("Selected injury area:", selectedInjury);
    router.back();
  };

  return (
    <BasicScreen title="Modifier la zone de blessure" headerClassName="bg-white">
      <View className="flex-1 px-4">
        <InjuryArea
          selectedInjury={selectedInjury}
          onSelectInjury={setSelectedInjury}
        />
      </View>

      {/* CTA Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-white">
        <Button
          text="Valider"
          type="primary"
          onPress={handleValidate}
          disabled={!selectedInjury}
        />
      </View>
    </BasicScreen>
  );
}
