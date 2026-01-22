import { Choices } from "@/components/choices";
import IcSearch from "@/components/icons/search";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import ManMuscleMap from "@/components/man-muscle-map";
import { TChoice } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import Text from "./text";

interface InjuryAreaProps {
  selectedInjury: TChoice | undefined;
  onSelectInjury: (injury: TChoice | undefined) => void;
}

export default function InjuryArea({
  selectedInjury,
  onSelectInjury,
}: InjuryAreaProps) {
  const [selectedTab, setSelectedTab] = useState("Liste");
  const [searchQuery, setSearchQuery] = useState("");

  const injuries: TChoice[] = [
    { text: "Abdominaux" },
    { text: "Adducteurs" },
    { text: "Adducteur Droit" },
    { text: "Adducteur Gauche" },
    { text: "Avant bras" },
    { text: "Avant Bras Droit" },
    { text: "Avant Bras Gauche" },
    { text: "Biceps" },
    { text: "Cheville" },
    { text: "Coude" },
  ];

  const filteredInjuries = injuries.filter((injury) =>
    injury.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="gap-4">
      {/* Tabs */}
      <Tabs
        tabs={["Liste", "Corps humain"]}
        selected={selectedTab}
        onSelected={setSelectedTab}
        className="mt-0"
        textClassName="text-base font-bold"
      />

      {selectedTab === "Liste" ? (
        <>
          {/* Search */}
          <Input
            leftIcon={<IcSearch size={16} />}
            placeholder="Rechercher"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Injury List */}
          <Choices
            data={filteredInjuries}
            selectedChoice={selectedInjury}
            onChange={onSelectInjury}
            type="radio"
            numColumns={1}
            itemClassName="py-3"
          />
        </>
      ) : (
        /* Corps humain view */
          <View className="items-center">
            <ManMuscleMap />
            <Text className="text-subtleText text-sm mt-6">Zone de la blessure</Text>
            <Text className="text-text text-base font-semibold mt-2">Aucune zone sélectionnée</Text>
          </View>
      )}
    </View>
  );
}
