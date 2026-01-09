import Button from "@/components/button";
import { Choices } from "@/components/choices";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcSearch from "@/components/icons/search";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import DatePicker from "@/components/date-picker";
import { TChoice } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import { ColorConst } from "@/constants/theme";
import { hexToRgba } from "@/utilities/cn";

export default function AddInjury() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 - Location
  const [selectedTab, setSelectedTab] = useState("Liste");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInjury, setSelectedInjury] = useState<TChoice | undefined>();

  // Step 2 - Date
  const [injuryDate, setInjuryDate] = useState<DateType>(undefined);

  // Step 3 - Description
  const [injuryName, setInjuryName] = useState("");
  const [injuryDescription, setInjuryDescription] = useState("");
  const [injuryStatus, setInjuryStatus] = useState<TChoice | undefined>();

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

  const injuryStatuses: TChoice[] = [{ text: "En cours" }, { text: "Soignée" }];

  const filteredInjuries = injuries.filter((injury) =>
    injury.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getPageTitle = () => {
    switch (currentStep) {
      case 1:
        return "Où es-tu blessé ?";
      case 2:
        return "Depuis quand es-tu blessé(e) ?";
      case 3:
        return "Décris ta blessure";
      default:
        return "";
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      console.log("Submitting injury:", {
        location: selectedInjury,
        date: injuryDate,
        name: injuryName,
        description: injuryDescription,
        status: injuryStatus,
      });
      router.back();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !selectedInjury;
      case 2:
        return !injuryDate;
      case 3:
        return !injuryName || !injuryDescription || !injuryStatus;
      default:
        return false;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-safe px-4 pb-4">
        <View className="flex-row items-center gap-1">
          <Pressable onPress={handleBack} className="p-2">
            <IcArrowLeft />
          </Pressable>
          <View className="flex-1">
            <Text className="text-lg font-bold text-secondary">
              {getPageTitle()}
            </Text>
          </View>
        </View>

        {/* Stepper */}
        <View className="flex-row gap-2 my-4 px-2">
          <View
            className={`flex-1 h-2 rounded-full ${
              currentStep >= 1 ? "bg-secondary" : "bg-light"
            }`}
          />
          <View
            className={`flex-1 h-2 rounded-full ${
              currentStep >= 2 ? "bg-secondary" : "bg-light"
            }`}
          />
          <View
            className={`flex-1 h-2 rounded-full ${
              currentStep >= 3 ? "bg-secondary" : "bg-light"
            }`}
          />
        </View>

        {/* Tabs - Only show on step 1 */}
        {currentStep === 1 && (
          <Tabs
            tabs={["Liste", "Corps humain"]}
            selected={selectedTab}
            onSelected={setSelectedTab}
            className="mt-4"
            textClassName="text-base font-bold"
          />
        )}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {/* Step 1 - Location Selection */}
        {currentStep === 1 && (
          <>
            {/* Search */}
            <Input
              leftIcon={<IcSearch size={16} />}
              placeholder="Rechercher"
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
          </>
        )}

        {/* Step 2 - Date Selection */}
        {currentStep === 2 && (
          <View className="gap-4">
            <DatePicker
              label="Date"
              labelOnTop
              selectedDate={injuryDate}
              onSelect={setInjuryDate}
              modalTitle="Sélectionner une date"
            />
          </View>
        )}

        {/* Step 3 - Description */}
        {currentStep === 3 && (
          <View className="gap-6">
            <Input
              label="Nom de la blessure"
              placeholder="Blessure Adducteur Droit"
              value={injuryName}
              onChangeText={setInjuryName}
            />

            <View className="gap-2">
              <Text className="text-accent font-medium text-sm">
                Décrivez votre blessure
              </Text>
              <View className="bg-white border border-stroke rounded-lg px-4 py-4">
                <TextInput
                  placeholder="Explique comment la blessure est survenue et en quoi elle te gêne au quotidien"
                  placeholderTextColor={hexToRgba(ColorConst.subtleText, 0.4)}
                  value={injuryDescription}
                  onChangeText={setInjuryDescription}
                  multiline
                  textAlignVertical="top"
                  className="text-base text-text min-h-32"
                />
              </View>
            </View>

            <Choices
              label="État de la blessure"
              data={injuryStatuses}
              selectedChoice={injuryStatus}
              onChange={setInjuryStatus}
              type="secondary"
              itemTextClassName="text-center font-medium"
            />
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* CTA Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-white">
        <Button
          text={currentStep === 3 ? "Enregistrer" : "Suivant"}
          type="primary"
          onPress={handleNext}
          disabled={isNextDisabled()}
        />
      </View>
    </View>
  );
}
