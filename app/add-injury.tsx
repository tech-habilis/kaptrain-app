import Button from "@/components/button";
import { Choices } from "@/components/choices";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcSearch from "@/components/icons/search";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { TChoice } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function AddInjury() {
  const [selectedTab, setSelectedTab] = useState("Liste");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInjury, setSelectedInjury] = useState<TChoice | undefined>();

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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-safe px-4 pb-4">
        <View className="flex-row items-center gap-1">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft />
          </Pressable>
          <View className="flex-1">
            <Text className="text-lg font-bold text-secondary">
              Où es-tu blessé ?
            </Text>
          </View>
        </View>

        {/* Stepper */}
        <View className="flex-row gap-2 mt-4 px-2">
          <View className="flex-1 h-2 rounded-full bg-secondary" />
          <View className="flex-1 h-2 rounded-full bg-light" />
          <View className="flex-1 h-2 rounded-full bg-light" />
        </View>

        {/* Tabs */}
        <Tabs
          tabs={["Liste", "Corps humain"]}
          selected={selectedTab}
          onSelected={setSelectedTab}
          className="mt-4"
          textClassName="text-base font-medium text-accent"
          selectedTextClassName="font-bold text-white"
        />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {/* Search */}
        <Input
          leftIcon={<IcSearch size={16} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="mb-4"
        />

        {/* Injury List */}
        <Choices
          data={filteredInjuries}
          selectedChoice={selectedInjury}
          onChange={setSelectedInjury}
          type="radio"
          numColumns={1}
          itemClassName="py-3"
        />

        <View className="h-32" />
      </ScrollView>

      {/* CTA Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-white">
        <Button
          text="Suivant"
          type="primary"
          onPress={() => {
            // Navigate to next step
            console.log("Selected injury:", selectedInjury);
          }}
          disabled={!selectedInjury}
        />
      </View>
    </View>
  );
}
