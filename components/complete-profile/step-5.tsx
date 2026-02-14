import Button from "@/components/button"
import Input from "@/components/input"
import { submitReferralCode } from "@/services/referral-code.service"
import { toast } from "@backpackapp-io/react-native-toast"
import { useState } from "react"

export function Step5({
  onConnectWithCoach,
  onContinueWithoutCoach,
}: {
  onContinueWithoutCoach: () => void
  onConnectWithCoach: () => void
}) {
  const [invitationCode, setInvitationCode] = useState("")
  const isConnectToCoachEnabled = invitationCode.length > 0
  const [submitting, setSubmitting] = useState(false)

  const handleConnectWithCoach = () => {
    if (!isConnectToCoachEnabled) return
    setSubmitting(true)
    submitReferralCode(invitationCode)
      .then((response) => {
        toast.success("Coach connected successfully")
        setSubmitting(false)
        setTimeout(() => {
          onConnectWithCoach()
        }, 1000)
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.message || "Failed to connect to coach")
        setSubmitting(false)
      })
  }

  return (
    <>
      <Input
        label="completeProfile.step5.invitationCode"
        placeholder="EX : JNKMD701"
        value={invitationCode || ""}
        onChangeText={(text) => {
          setInvitationCode(text.toUpperCase())
        }}
        className="mt-16"
      />

      <Button
        text="completeProfile.step5.connectToCoach"
        className="mt-4"
        disabled={!isConnectToCoachEnabled}
        loading={submitting}
        onPress={handleConnectWithCoach}
      />

      <Button
        text="completeProfile.step5.continueWithoutCoach"
        type="tertiary"
        onPress={onContinueWithoutCoach}
      />
    </>
  )
}
