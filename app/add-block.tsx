import Button from "@/components/button";
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
import { choicesToExercises, TChoice } from "@/types";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import Input from "@/components/input";
import getExercises, {
  intensityOptions,
  zoneReference,
} from "@/constants/mock";
import Tabs from "@/components/tabs";
import IcInfoCircle from "@/components/icons/info-circle";
import { clsx } from "clsx";
import ExerciseCards from "@/components/exercise-cards";
import BasicScreen from "@/components/basic-screen";
import { TimerPickerModal } from "react-native-timer-picker";
import IcChevronDown from "@/components/icons/chevron-down";
import FilterAndSelectModal from "@/components/filter-and-select-modal";

export default function AddBlock() {
  const { mode } = useLocalSearchParams();
  const isEditing = mode === "edit";

  // Validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    intensity?: string;
    exercises?: string;
  }>({});

  const [blockTitle, setBlockTitle] = useState<string>(
    "Travail de l'endurance aérobie haute, zone Z4 (~95 % de la VMA)",
  );
  const [blockDescription, setBlockDescription] = useState<string>(
    "Travail ciblé sur l'endurance aérobie haute.\n\nL Répétitions à 95 % de la VMA :\nL'objectif est de maintenir une allure soutenue sur 400 m avec un temps de passage autour de 1'30. \nVeillez à conserver une bonne technique de course tout au long des répétitions. \n\n→ Récupération passive ou active selon le niveau de fatigue. Adapté aux objectifs de développement du seuil aérobie.",
  );

  const [selectedIntensity, setSelectedIntensity] = useState<TChoice>(
    intensityOptions[0],
  );

  const durationOrDistanceTabs = ["Temps", "Distance"];
  const [tabDurationOrDistance, setTabDurationOrDistance] = useState(
    durationOrDistanceTabs[0],
  );

  const [series, setSeries] = useState<string>();
  const [recovery, setRecovery] = useState<string>();

  const defaultVmaDuration = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  const [showInputTime, setShowInputTime] = useState(false);
  const [vmaDuration, setVmaDuration] = useState<typeof defaultVmaDuration>();
  const [vmaDistance, setVmaDistance] = useState("");

  const zones: TChoice[] = zoneReference.slice(1).map((x) => ({
    id: x.id,
    text: x.zone,
    secondaryText: x.percentage,
  }));
  const [selectedZone, setSelectedZone] = useState<TChoice>();

  const referenceModalRef = useRef<BottomSheetModalType>(null);
  const [selectedExercises, setSelectedExercises] = useState<TChoice[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const availableExercises = getExercises({ isGridView: true });
  const exerciseChoices: TChoice[] = availableExercises.map((ex) => ({
    id: ex.id,
    text: ex.title,
    leftIcon: ex.icon,
  }));

  const removeExercise = (id: string) => {
    setSelectedExercises((x) => x.filter((y) => y.id !== id));
  };

  const renderDurationOrDistanceTabs = () => {
    if (tabDurationOrDistance === "Distance") {
      return (
        <Input
          value={vmaDistance}
          onChangeText={setVmaDistance}
          placeholder="0 km"
          inputClassName="text-center"
          translate={false}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      );
    }

    return (
      <>
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
          translate={false}
        />

        <TimerPickerModal
          closeOnOverlayPress
          modalProps={{
            overlayOpacity: 0.2,
          }}
          onCancel={() => setShowInputTime(false)}
          onConfirm={({ hours, minutes, seconds }) => {
            setVmaDuration({ hours, minutes, seconds });
            setShowInputTime(false);
          }}
          styles={{
            theme: "light",
          }}
          visible={showInputTime}
          setIsVisible={() => setShowInputTime(false)}
          initialValue={defaultVmaDuration}
          hideDays
        />
      </>
    );
  };

  const validateAndSave = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate title
    if (!blockTitle || blockTitle.trim().length === 0) {
      newErrors.title = "Le titre du bloc est requis";
    }

    // Validate description
    if (!blockDescription || blockDescription.trim().length === 0) {
      newErrors.description = "La description du bloc est requise";
    }

    // Validate intensity
    if (!selectedIntensity?.text) {
      newErrors.intensity = "La référence d'intensité est requise";
    }

    // Validate exercises
    if (selectedExercises.length === 0) {
      newErrors.exercises = "Au moins un exercice est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        contentContainerClassName="px-4 pb-38"
        showsVerticalScrollIndicator={false}
      >
        {/* Block Title Input */}
        <View className="gap-3 mb-6">
          <View className="flex-row items-start">
            <TextInput
              value={blockTitle}
              onChangeText={(text) => {
                setBlockTitle(text);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Titre du bloc"
              placeholderTextColor={ColorConst.subtleText}
              multiline
              className="flex-1 text-base font-semibold text-secondary leading-6"
            />
          </View>
          {errors.title && (
            <Text className="text-error text-sm">{errors.title}</Text>
          )}

          {/* Block Description */}
          <TextInput
            value={blockDescription}
            onChangeText={(text) => {
              setBlockDescription(text);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Description du bloc"
            placeholderTextColor={ColorConst.subtleText}
            multiline
            className="text-base text-subtleText leading-6"
            style={{ minHeight: 120 }}
          />
          {errors.description && (
            <Text className="text-error text-sm">{errors.description}</Text>
          )}
        </View>

        {/* Intensity Reference Dropdown */}
        <View className="mb-6">
          <Dropdown
            modalHeight="90%"
            label="Référence d'intensité"
            options={intensityOptions}
            selectedOption={selectedIntensity}
            onSelect={(choice) => {
              setSelectedIntensity(choice);
              setErrors((prev) => ({ ...prev, intensity: undefined }));
            }}
            modalTitle="Choisis une référence d'intensité"
            size="large"
            className="justify-between"
            alwaysShowLabel
          />
          {errors.intensity && (
            <Text className="text-error text-sm mt-2">{errors.intensity}</Text>
          )}
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
                value={series}
                onChangeText={setSeries}
                className="grow"
                inputClassName="text-base font-normal"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />

              <Input
                placeholder="0s"
                type="unit"
                unit="Récup"
                value={recovery}
                onChangeText={setRecovery}
                className="grow"
                inputClassName="text-base font-normal"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>

            <Tabs
              tabs={durationOrDistanceTabs}
              selected={tabDurationOrDistance}
              onSelected={setTabDurationOrDistance}
            />

            {renderDurationOrDistanceTabs()}

            <Tabs
              tabs={["Zone", "%"]}
              selected="Zone"
              onSelected={() => null}
            />
            <Dropdown
              type="input"
              placeholder="Z1 30-50%"
              options={zones}
              selectedOption={selectedZone}
              onSelect={setSelectedZone}
              modalHeight="90%"
              rightIcon={<IcChevronDown />}
              formatLabel={(choice) => `${choice.text} ${choice.secondaryText}`}
              inputWrapperClassName="justify-center"
              textClassName="flex-none"
            />

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
                data={zoneReference}
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
          <ExerciseCards
            exercises={choicesToExercises(
              selectedExercises,
              availableExercises,
            )}
            onRemoveExercise={(id) => {
              removeExercise(id);
              setErrors((prev) => ({ ...prev, exercises: undefined }));
            }}
          />

          {errors.exercises && (
            <Text className="text-error text-sm">{errors.exercises}</Text>
          )}

          {/* Add Exercise Button */}
          <Button
            type="tertiary"
            size="small"
            text="Ajouter des exercices"
            leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
            onPress={() => setShowAddExerciseModal(true)}
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
            if (validateAndSave()) {
              // Save block and go back
              router.back();
            }
          }}
          className="mb-6"
        />
      </View>

      <FilterAndSelectModal
        choices={exerciseChoices}
        selectedChoices={selectedExercises}
        onSelected={(selected) => setSelectedExercises(selected as TChoice[])}
        name="add-exercise-to-block-modal"
        show={showAddExerciseModal}
        onDismiss={() => setShowAddExerciseModal(false)}
        height="90%"
      />
    </BasicScreen>
  );
}
