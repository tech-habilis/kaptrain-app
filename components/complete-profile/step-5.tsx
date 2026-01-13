import Button from "@/components/button";
import Input from "@/components/input";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";

export function Step5({
  onConnectWithCoach,
  onContinueWithoutCoach,
}: {
  onContinueWithoutCoach: () => void;
  onConnectWithCoach: () => void;
}) {
  const { formData, updateStep5 } = useCompleteProfileStore();
  const isConnectToCoachEnabled =
    formData.invitationCode && formData.invitationCode.length > 0;

  return (
    <>
      <Input
        label="completeProfile.step5.invitationCode"
        placeholder="EX : JNKMD701"
        value={formData.invitationCode || ""}
        onChangeText={(text) => {
          updateStep5({ invitationCode: text.toUpperCase() });
        }}
        className="mt-16"
      />

      <Button
        text="completeProfile.step5.connectToCoach"
        className="mt-4"
        disabled={!isConnectToCoachEnabled}
        onPress={() => {
          if (!isConnectToCoachEnabled) return;
          onConnectWithCoach();
        }}
      />

      <Button
        text="completeProfile.step5.continueWithoutCoach"
        type="tertiary"
        onPress={onContinueWithoutCoach}
      />
    </>
  );
}
