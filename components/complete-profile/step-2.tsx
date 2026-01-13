import Button from "@/components/button";
import Input from "@/components/input";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export function Step2() {
  const { t } = useTranslation();
  const { formData, errors, updateStep2 } = useCompleteProfileStore();
  const [weightInput, setWeightInput] = useState(formData.weight?.toString() || "");

  // Sync local state with store when formData changes
  useEffect(() => {
    if (formData.weight !== undefined && weightInput === "") {
      setWeightInput(formData.weight.toString());
    }
  }, [formData.weight, weightInput]);

  const handleWeightChange = (text: string) => {
    setWeightInput(text);

    // Replace comma with dot to handle both decimal separators
    const normalizedText = text.replace(',', '.');
    const weight = normalizedText ? parseFloat(normalizedText) : undefined;

    // Only update if we have a valid number (not NaN)
    if (!isNaN(weight as number) && text !== '') {
      updateStep2({ weight });
    } else if (text === '') {
      updateStep2({ weight: undefined });
    }
  };

  return (
    <>
      <Input
        label="completeProfile.step2.currentWeight"
        className="mt-8"
        placeholder="00.00"
        type="unit"
        unit="kg"
        value={weightInput}
        onChangeText={handleWeightChange}
        error={errors.weight ? t(errors.weight) : undefined}
      />
      <Button
        text="completeProfile.step2.preferNotToAnswer"
        type="secondary"
        className="rounded-lg mt-3"
        onPress={() => {
          updateStep2({ preferNotToAnswer: true, weight: undefined });
          setWeightInput("");
        }}
      />
    </>
  );
}
