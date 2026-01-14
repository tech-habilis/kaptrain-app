import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import { useState } from "react";
import { View } from "react-native";

export default function ConfigureShapeTracking() {
  const choices: TChoice[] = [
    {
      text: "Toujours demander à chaque connexion (recommandé)",
      secondaryText:
        "Accède à ta forme du jour dès ta connexion pour la remplir instantanément.",
    },
    {
      text: "Ne pas afficher par défaut",
      secondaryText:
        "Accède à ta forme du jour uniquement lorsque tu le décides, directement depuis la page d'accueil.",
    },
  ];
  const [selectedChoice, setSelectedChoice] = useState<TChoice>();

  return (
    <BasicScreen
      title="Suivi de forme"
      description="Chaque matin, ce suivi te permet d’enregistrer 6 indicateurs pour évaluer ton état de forme. Active ou désactive son affichage automatique dès la connexion."
    >
      <View className="px-4 mt-6 flex-1 pb-safe">
        <Choices
          label="Veux-tu remplir ton suivi de forme à chaque connexion ?"
          data={choices}
          type="radio"
          selectedChoice={selectedChoice}
          onChange={setSelectedChoice}
          inactiveItemClassName="border-white"
        />

        <View className="grow" />

        <Button
          text="Enregistrer les modifications"
          size="large"
          disabled={!selectedChoice}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  );
}
