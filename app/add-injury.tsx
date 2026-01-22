import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import DatePicker from "@/components/date-picker";
import InjuryArea from "@/components/injury-area";
import InjuryForm from "@/components/injury-form";
import { TChoice } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";

export default function AddInjury() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 - Location
  const [selectedInjury, setSelectedInjury] = useState<TChoice | undefined>();

  // Step 2 - Date
  const [injuryDate, setInjuryDate] = useState<DateType>(undefined);

  // Step 3 - Description
  const [injuryName, setInjuryName] = useState("");
  const [injuryDescription, setInjuryDescription] = useState("");
  const [injuryStatus, setInjuryStatus] = useState<TChoice | undefined>();

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
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {/* Step 1 - Location Selection */}
        {currentStep === 1 && (
          <InjuryArea
            selectedInjury={selectedInjury}
            onSelectInjury={setSelectedInjury}
          />
        )}

        {/* Step 2 - Date Selection */}
        {currentStep === 2 && (
          <View className="gap-4">
            <DatePicker
              label="Date"
              selectedDate={injuryDate}
              onSelect={setInjuryDate}
              modalTitle="Sélectionner une date"
              labelOnTop
            />
          </View>
        )}

        {/* Step 3 - Description */}
        {currentStep === 3 && (
          <InjuryForm
            mode="create"
            injuryName={injuryName}
            onChangeInjuryName={setInjuryName}
            injuryDescription={injuryDescription}
            onChangeInjuryDescription={setInjuryDescription}
            injuryStatus={injuryStatus}
            onChangeInjuryStatus={setInjuryStatus}
          />
        )}

        <View className="h-32" />
      </View>

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
