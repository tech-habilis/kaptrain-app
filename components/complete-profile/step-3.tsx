import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";

export function Step3() {
  const { formData, updateStep3 } = useCompleteProfileStore();

  const choices: TChoice[] = [
    {
      id: "id-completeProfile.step3.levelBeginner",
      text: "completeProfile.step3.levelBeginner",
      secondaryText: "completeProfile.step3.levelBeginnerHours",
    },
    {
      id: "id-completeProfile.step3.levelIntermediate",
      text: "completeProfile.step3.levelIntermediate",
      secondaryText: "completeProfile.step3.levelIntermediateHours",
    },
    {
      id: "id-completeProfile.step3.levelAdvanced",
      text: "completeProfile.step3.levelAdvanced",
      secondaryText: "completeProfile.step3.levelAdvancedHours",
    },
    {
      id: "id-completeProfile.step3.levelConfirmed",
      text: "completeProfile.step3.levelConfirmed",
      secondaryText: "completeProfile.step3.levelConfirmedHours",
    },
    {
      id: "id-completeProfile.step3.levelExpert",
      text: "completeProfile.step3.levelExpert",
      secondaryText: "completeProfile.step3.levelExpertHours",
    },
  ];

  const selectedChoice = choices.find((c) => c.text === formData.sportLevel);

  return (
    <Choices
      data={choices}
      selectedChoice={selectedChoice}
      onChange={(choice) => updateStep3({ sportLevel: choice.text })}
      type="secondary"
      className="mt-8"
    />
  );
}
