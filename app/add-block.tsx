import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import IcClose from "@/components/icons/close";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import Dropdown from "@/components/dropdown";
import { TChoice } from "@/types";

interface Exercise {
  id: string;
  title: string;
  image: string;
}

export default function AddBlock() {
  const [blockTitle, setBlockTitle] = useState<string>(
    "Travail de l'endurance aérobie haute, zone Z4 (~95 % de la VMA)",
  );
  const [blockDescription, setBlockDescription] = useState<string>(
    "Travail ciblé sur l'endurance aérobie haute.\n\nL Répétitions à 95 % de la VMA :\nL'objectif est de maintenir une allure soutenue sur 400 m avec un temps de passage autour de 1'30. \nVeillez à conserver une bonne technique de course tout au long des répétitions. \n\n→ Récupération passive ou active selon le niveau de fatigue. Adapté aux objectifs de développement du seuil aérobie.",
  );

  const intensityOptions: TChoice[] = [
    { text: "Aucun" },
    { text: "FORCE (%RM)" },
    { text: "Cardiaque (%FC Max)" },
    { text: "Puissance (%PMA)" },
    { text: "Puissance (%FTP)" },
    { text: "Vitesse (%VMA)" },
    { text: "Vitesse (Vitesse brute)" },
    { text: "Ressenti (RPE physique)" },
    { text: "Ressenti (RPE cognitif)" },
  ];

  const [selectedIntensity, setSelectedIntensity] = useState<TChoice>(
    intensityOptions[0],
  );
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      title: "Abmat sit up",
      image: "https://via.placeholder.com/200",
    },
    {
      id: "2",
      title: "Abmat sit up",
      image: "https://via.placeholder.com/200",
    },
    {
      id: "3",
      title: "Abmat sit up",
      image: "https://via.placeholder.com/200",
    },
  ]);

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="flex-row items-center py-2">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft color={ColorConst.secondary} />
          </Pressable>
          <Text className="text-lg font-bold text-secondary flex-1 ml-1">
            Ajouter un bloc
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Block Title Input */}
        <View className="gap-3 mb-6">
          <View className="flex-row items-start" style={{ minHeight: 48 }}>
            <TextInput
              value={blockTitle}
              onChangeText={setBlockTitle}
              placeholder="Titre du bloc"
              placeholderTextColor={ColorConst.subtleText}
              multiline
              className="flex-1 text-base font-semibold text-secondary leading-6"
              style={{ minHeight: 48 }}
            />
          </View>

          {/* Block Description */}
          <TextInput
            value={blockDescription}
            onChangeText={setBlockDescription}
            placeholder="Description du bloc"
            placeholderTextColor={ColorConst.subtleText}
            multiline
            className="text-base text-subtleText leading-6"
            style={{ minHeight: 120 }}
          />
        </View>

        {/* Intensity Reference Dropdown */}
        <View className="mb-6">
          <Dropdown
            label="Référence d’intensité"
            options={intensityOptions}
            selectedOption={selectedIntensity}
            onSelect={setSelectedIntensity}
            modalTitle="Choisis une référence d'intensité"
            size="large"
            className="justify-between"
            alwaysShowLabel
          />
        </View>

        {/* Exercises Section */}
        <View className="gap-3">
          <Text className="text-sm font-medium text-text">
            Exercices associés :
          </Text>

          {/* Exercise Cards - Horizontal Scroll */}
          <View className="relative">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              {exercises.map((exercise) => (
                <View
                  key={exercise.id}
                  className="border border-stroke rounded-xl overflow-hidden relative"
                  style={{ width: 198.51, height: 145.63 }}
                >
                  {/* Exercise Image */}
                  <View className="absolute inset-0 bg-light">
                    {/* Placeholder for image */}
                    <View className="w-full h-full bg-light" />
                  </View>

                  {/* Gradient Overlay */}
                  <View
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <View
                      className="absolute inset-0"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    />
                  </View>

                  {/* Exercise Title */}
                  <View className="absolute bottom-0 left-0 right-0 p-3">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-semibold text-white">
                        {exercise.title}
                      </Text>
                    </View>
                  </View>

                  {/* Close Button */}
                  <Pressable
                    onPress={() => removeExercise(exercise.id)}
                    className="absolute top-3 right-3 w-5 h-5 items-center justify-center"
                  >
                    <IcClose size={18} color="white" />
                  </Pressable>

                  {/* Play Button Overlay */}
                  <View className="absolute inset-0 items-center justify-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: "rgba(5, 24, 50, 0.15)",
                      }}
                    >
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          marginLeft: 2,
                          borderLeftWidth: 8,
                          borderTopWidth: 6,
                          borderBottomWidth: 6,
                          borderLeftColor: "white",
                          borderTopColor: "transparent",
                          borderBottomColor: "transparent",
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Add Exercise Button */}
          <Button
            type="tertiary"
            size="small"
            text="Ajouter des exercices"
            leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
            onPress={() => {
              // Navigate to exercise selection
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe">
        <Button
          text="Enregistrer le bloc"
          type="primary"
          size="large"
          onPress={() => {
            // Save block and go back
            router.back();
          }}
        />
      </View>
    </View>
  );
}
