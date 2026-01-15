import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Dropdown from "@/components/dropdown";
import { Exercise, TChoice } from "@/types";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import Input from "@/components/input";
import IcSearch from "@/components/icons/search";
import IcFilter from "@/components/icons/filter";
import getExercises, { mockExercises } from "@/constants/mock";
import { Choices } from "@/components/choices";
import Tabs from "@/components/tabs";
import IcInfoCircle from "@/components/icons/info-circle";
import { clsx } from "clsx";
import ExerciseCards from "@/components/exercise-cards";
import BasicScreen from "@/components/basic-screen";
import { TimerPickerModal } from "react-native-timer-picker";

export default function AddBlock() {
  const { mode } = useLocalSearchParams();
  const isEditing = mode === "edit";

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
  const [vmaValue, setVmaValue] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const defaultVmaDuration = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  const [showInputTime, setShowInputTime] = useState(false);
  const [vmaDuration, setVmaDuration] = useState<typeof defaultVmaDuration>();

  const reference = [
    {
      zone: "Zones",
      percentage: "Pourcentage VMA",
      targetPace: "Allure cible (km/h)",
      color: ColorConst.secondary,
    },
    {
      zone: "Z1",
      percentage: "30-50%",
      targetPace: "9:00 – 6:00",
      color: ColorConst.success,
    },
    {
      zone: "Z2",
      percentage: "51-70%",
      targetPace: "5:53 – 4:17",
      color: "#CEA700",
    },
    {
      zone: "Z3",
      percentage: "71-91%",
      targetPace: "4:13 – 3:45",
      color: "#DB8000",
    },
    {
      zone: "Z4",
      percentage: "85-105%",
      targetPace: "3:42 – 3:18",
      color: "#E65B08",
    },
    {
      zone: "Z5",
      percentage: "91-105%",
      targetPace: "3:18 – 3:00",
      color: "#E35D56",
    },
    { zone: "Z6", percentage: "150%", targetPace: "2:30", color: "#E04D60" },
    { zone: "Z7", percentage: "250%", targetPace: "1:30", color: "#BA0003" },
  ];

  const referenceModalRef = useRef<BottomSheetModalType>(null);
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<TChoice[]>([]);

  const availableExercises = getExercises({ isGridView: true });
  const exerciseChoices: TChoice[] = availableExercises.map((ex) => ({
    text: ex.title,
    leftIcon: ex.icon,
  }));

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const addSelectedExercises = () => {
    const newExercises = selectedExercises.map((choice) => {
      const exercise = availableExercises.find(
        (ex) => ex.title === choice.text,
      );
      return {
        id: exercise?.id || String(Date.now()),
        title: choice.text,
        image: exercise?.image || "",
      };
    });
    setExercises([...exercises, ...newExercises]);
    setSelectedExercises([]);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BasicScreen
      title={isEditing ? "Modifier le bloc" : "Ajouter un bloc"}
      headerClassName="bg-white"
    >
      <StatusBar style="dark" />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Block Title Input */}
        <View className="gap-3 mb-6">
          <View className="flex-row items-start">
            <TextInput
              value={blockTitle}
              onChangeText={setBlockTitle}
              placeholder="Titre du bloc"
              placeholderTextColor={ColorConst.subtleText}
              multiline
              className="flex-1 text-base font-semibold text-secondary leading-6"
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
            modalHeight="90%"
            label="Référence d'intensité"
            options={intensityOptions}
            selectedOption={selectedIntensity}
            onSelect={setSelectedIntensity}
            modalTitle="Choisis une référence d'intensité"
            size="large"
            className="justify-between"
            alwaysShowLabel
          />
        </View>

        {/* VMA Form - Show when Vitesse (%VMA) is selected */}
        {selectedIntensity.text === "Vitesse (%VMA)" && (
          <View className="mb-6 gap-2">
            <View className="flex-row items-center gap-2">
              <Text>Vitesse maximale aérobie (VMA)</Text>
              <Pressable onPress={() => referenceModalRef.current?.present()}>
                <IcInfoCircle />
              </Pressable>
            </View>
            <View className="flex-row items-center gap-4">
              <Input
                placeholder="0"
                type="unit"
                unit="series"
                value={vmaValue}
                onChangeText={setVmaValue}
                className="grow"
                inputClassName="text-base font-normal"
              />

              <Input
                placeholder="0s"
                type="unit"
                unit="Récup"
                value={vmaValue}
                onChangeText={setVmaValue}
                className="grow"
                inputClassName="text-base font-normal"
              />
            </View>

            <Tabs
              tabs={["Temps", "Distance"]}
              selected="Temps"
              onSelected={() => null}
            />

            <Input
              value={
                vmaDuration
                  ? Object.values(vmaDuration)
                      .map((x) => x.toString().padStart(2, "0"))
                      .join(":")
                  : undefined
              }
              asPressable
              onPress={() => setShowInputTime(true)}
              placeholder="00:00:00"
              inputClassName="text-center"
            />
            <TimerPickerModal
              closeOnOverlayPress
              modalProps={{
                overlayOpacity: 0.2,
              }}
              onCancel={() => setShowInputTime(false)}
              onConfirm={({ hours, minutes }) => {}}
              styles={{
                theme: "light",
              }}
              visible={showInputTime}
              setIsVisible={() => setShowInputTime(false)}
              initialValue={defaultVmaDuration}
              hideSeconds
            />

            <Tabs
              tabs={["Zone", "%"]}
              selected="Zone"
              onSelected={() => null}
            />
            <Input placeholder="Z1 30-50%" inputClassName="text-center" />

            <BottomSheetModal
              ref={referenceModalRef}
              name="reference-modal-ref"
              snapPoints={["50%"]}
            >
              <View className="flex-row gap-2">
                <Image
                  source={require("../assets/images/sample-avatar.png")}
                  className="rounded-md"
                />
                <View className="justify-center">
                  <Text className="text-subtleText text-sm">
                    Camille Durand
                  </Text>
                  <Text className="text-sm font-semibold">
                    VMA de référence : 16,5 km/h
                  </Text>
                </View>
              </View>
              <FlatList
                contentContainerClassName="mt-6"
                data={reference}
                renderItem={({ item, index }) => (
                  <View className="flex-row items-center overflow-hidden">
                    <Text
                      className={clsx("border border-stroke py-1 px-4 w-1/5", {
                        "font-medium text-secondary": index === 0,
                      })}
                      style={{ color: item.color }}
                    >
                      {item.zone}
                    </Text>
                    <Text
                      className={clsx("border border-stroke py-1 px-4 w-2/5", {
                        "font-medium text-secondary": index === 0,
                      })}
                    >
                      {item.percentage}
                    </Text>
                    <Text
                      className={clsx("border border-stroke py-1 px-4 w-2/5", {
                        "font-medium text-secondary": index === 0,
                      })}
                    >
                      {item.targetPace}
                    </Text>
                  </View>
                )}
              />
            </BottomSheetModal>
          </View>
        )}

        {/* Exercises Section */}
        <View className="gap-3">
          {/* Exercise Cards - Horizontal Scroll */}
          <ExerciseCards
            exercises={exercises}
            onRemoveExercise={(id) => removeExercise(id)}
          />

          {/* Add Exercise Button */}
          <Button
            type="tertiary"
            size="small"
            text="Ajouter des exercices"
            leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe gap-2">
        <Button
          type="secondary"
          text="Supprimer le bloc"
          onPress={() => {}}
          className={clsx({
            hidden: !isEditing,
          })}
        />

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

      {/* Exercise Selection Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="exercise-selection"
        snapPoints={["90%"]}
        className="pb-0"
      >
        <View className="flex-1">
          {/* Search and Filter */}
          <View className="gap-3 mb-4">
            <Input
              leftIcon={<IcSearch />}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Button
              type="secondaryV2"
              size="small"
              text="Filtres"
              leftIcon={<IcFilter />}
              onPress={() => {
                // Open filter modal
              }}
            />
          </View>

          {/* Exercise List */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <Choices
              data={exerciseChoices}
              selectedChoices={selectedExercises}
              onChangeMultiple={setSelectedExercises}
              type="multipleChoice"
            />
          </ScrollView>

          {/* Bottom CTA */}
          {selectedExercises.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 pb-6">
              <Button
                text={`Ajouter ${selectedExercises.length} exercice${selectedExercises.length > 1 ? "s" : ""}`}
                type="primary"
                size="large"
                onPress={addSelectedExercises}
              />
            </View>
          )}
        </View>
      </BottomSheetModal>
    </BasicScreen>
  );
}
