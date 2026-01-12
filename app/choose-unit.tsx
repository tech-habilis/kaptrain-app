import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import { useState } from "react";
import { View } from "react-native";

export default function ChooseUnit() {
  const weightChoices: TChoice[] = [
    {
      text: "Kilogrammes (kg)",
    },
    {
      text: "Livres (lbs) ",
    },
  ];

  const heightChoices: TChoice[] = [
    {
      text: "Centimètres (cm)",
    },
    {
      text: "Pieds / pouces (ft/inch)",
    },
  ];

  const [selectedWeight, setSelectedWeight] = useState<TChoice>();
  const [selectedHeight, setSelectedHeight] = useState<TChoice>();

  return (
    <BasicScreen
      title="Choisir les unités"
      description="Personnalise les unités de mesure que tu préfères utiliser dans l’app."
    >
      <View className="px-4 mt-6 flex-1 pb-safe gap-6">
        <Choices
          label="Poids / Masse corporelle"
          data={weightChoices}
          type="radio"
          selectedChoice={selectedWeight}
          onChange={setSelectedWeight}
          inactiveItemClassName="border-white"
        />

        <Choices
          label="Taille"
          data={heightChoices}
          type="radio"
          selectedChoice={selectedHeight}
          onChange={setSelectedHeight}
          inactiveItemClassName="border-white"
        />

        <View className="grow" />

        <Button
          text="Enregistrer les modifications"
          size="large"
          disabled={!selectedWeight || !selectedHeight}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  );
}
