import BasicScreen from "@/components/basic-screen";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import { useState } from "react";
import { View } from "react-native";

export default function ConfigureFeeling() {
  const choices: TChoice[] = [
    {
      text: "Ressenti global",
      secondaryText:
        "Évalue simplement ton ressenti global à l’aide d’un seul indicateur.",
    },
    {
      text: "Ressenti mental et physique",
      secondaryText:
        "Distingue ton ressenti physique et mental pour un suivi plus précis.",
    },
  ];
  const [selectedChoice, setSelectedChoice] = useState<TChoice>(choices[0]);

  return (
    <BasicScreen
      title="Configurer mon ressenti"
      description="Personnalise la manière dont tu évalues ton ressenti après chaque séance."
    >
      <View className="px-4 mt-6">
        <Choices
          label="Comment veux-tu évaluer ton effort ?"
          data={choices}
          type="radio"
          selectedChoice={selectedChoice}
          onChange={setSelectedChoice}
          inactiveItemClassName="border-white"
        />
      </View>
    </BasicScreen>
  );
}
