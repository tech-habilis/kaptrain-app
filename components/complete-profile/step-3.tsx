import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";

export function Step3() {
  const { formData, updateStep3 } = useCompleteProfileStore();

  const choices: TChoice[] = [
    {
      text: "completeProfile.step3.levelBeginner",
      secondaryText: "completeProfile.step3.levelBeginnerHours",
    },
    {
      text: "completeProfile.step3.levelIntermediate",
      secondaryText: "completeProfile.step3.levelIntermediateHours",
    },
    {
      text: "completeProfile.step3.levelAdvanced",
      secondaryText: "completeProfile.step3.levelAdvancedHours",
    },
    {
      text: "completeProfile.step3.levelConfirmed",
      secondaryText: "completeProfile.step3.levelConfirmedHours",
    },
    {
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
