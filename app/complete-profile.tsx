import Button from "@/components/button"
import { Step1 } from "@/components/complete-profile/step-1"
import { Step2 } from "@/components/complete-profile/step-2"
import { Step3 } from "@/components/complete-profile/step-3"
import { Step4 } from "@/components/complete-profile/step-4"
import { Step5 } from "@/components/complete-profile/step-5"
import FadedBottomBar from "@/components/faded-bottom-bar"
import IcArrowLeft from "@/components/icons/arrow-left"
import Text from "@/components/text"
import { toast } from "@/components/toast"
import { ROUTE } from "@/constants/route"
import { useSession } from "@/contexts/auth-context"
import { useCompleteProfileStore } from "@/stores/complete-profile-store"
import cn from "@/utilities/cn"
import { router, useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
  View,
} from "react-native"

const STEP_CONFIG = {
  1: {
    title: "completeProfile.step1.title",
    description: "completeProfile.step1.description",
    progress: "completeProfile.step1.progress",
  },
  2: {
    title: "completeProfile.step2.title",
    description: "completeProfile.step2.description",
    progress: "completeProfile.step2.progress",
  },
  3: {
    title: "completeProfile.step3.title",
    description: "completeProfile.step3.description",
    progress: "completeProfile.step3.progress",
  },
  4: {
    title: "completeProfile.step4.title",
    description: "completeProfile.step4.description",
    progress: "completeProfile.step4.progress",
  },
  5: {
    title: "completeProfile.step5.title",
    description: "completeProfile.step5.description",
    progress: "completeProfile.step5.progress",
  },
}

export default function CompleteProfile() {
  const { session } = useSession()
  const { step: stepParam } = useLocalSearchParams()
  const {
    currentStep,
    nextStep,
    previousStep,
    setCurrentStep,
    validateStep,
    formData,
    saveStep,
    isSaving,
    isLoading,
    loadProfileData,
  } = useCompleteProfileStore()

  const config = STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]

  // Load existing profile data on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadProfileData(session.user.id, {
        name: session.user.name,
        avatarUrl: session.user.avatarUrl,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  // FOR DEV ONLY; handle step parameter from URL (?step=N)
  useEffect(() => {
    if (__DEV__ && stepParam) {
      const step = parseInt(stepParam.toString(), 10)
      if (!isNaN(step) && step >= 1 && step <= 5) {
        setCurrentStep(step)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepParam])

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (currentStep > 1) {
          // Navigate to previous step instead of going back to OTP screen
          previousStep()
          return true // Prevent default back behavior
        }
        // On step 1, allow default back behavior (go to OTP screen)
        return false
      }
    )

    return () => backHandler.remove()
  }, [currentStep, previousStep])

  const handleContinue = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (!session?.user?.id) {
      toast.error("User session not found")
      return
    }

    // Save to Supabase
    const saved = await saveStep(currentStep, session.user.id)
    if (!saved) {
      // Save failed, don't proceed
      return
    }

    // Proceed to next step or complete
    if (currentStep < 5) {
      nextStep()
    } else {
      // All steps completed, navigate to profile completed
      router.replace(ROUTE.PROFILE_COMPLETED)
    }
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.birthDate &&
          formData.gender
        )
      case 2:
        return true // Step 2 is optional
      case 3:
        return !!formData.sportLevel
      case 4:
        return formData.selectedSports && formData.selectedSports.length > 0
      case 5:
        return true // Step 5 is optional
      default:
        return false
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      previousStep()
    } else {
      router.back()
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 continueToNextStep={handleContinue} />
      case 3:
        return <Step3 />
      case 4:
        return <Step4 />
      case 5:
        return (
          <Step5
            onConnectWithCoach={handleContinue}
            onContinueWithoutCoach={handleContinue}
          />
        )
      default:
        return <Step1 />
    }
  }

  return (
    <>
      <View className="pt-safe px-4 flex-1 bg-white">
        <StatusBar style="dark" />
        {isLoading ? (
          <View className="flex-1 justify-center items-center gap-4">
            <ActivityIndicator size="large" />
            <Text className="text-subtleText">Loading profile data...</Text>
          </View>
        ) : (
          <>
            {currentStep > 1 && (
              <Pressable className="pb-4" onPress={handleBack}>
                <IcArrowLeft />
              </Pressable>
            )}
            <Text
              className={cn(
                "text-secondary font-ls-bold",
                currentStep === 1 ? "text-2xl" : "text-2xl mt-2"
              )}
            >
              {config.title}
            </Text>
            <Text className="text-subtleText mt-1">{config.description}</Text>

            <ScrollView
              className="flex-1"
              contentContainerClassName="mb-safe pb-8"
              showsVerticalScrollIndicator={false}
            >
              {renderStep()}
            </ScrollView>
          </>
        )}
      </View>
      {!isLoading && (
        <FadedBottomBar className="pt-8">
          <View className="gap-2 grow">
            <Text className="text-subtleText">{config.progress}</Text>
            <View className="flex-row gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <View
                  key={index}
                  className={cn(
                    "flex-1 h-2 rounded-full",
                    index < currentStep ? "bg-secondary" : "bg-stroke"
                  )}
                />
              ))}
            </View>
          </View>
          {currentStep < Object.keys(STEP_CONFIG).length && (
            <Button
              text="common.continue"
              className="grow"
              onPress={handleContinue}
              disabled={!isStepComplete() || isSaving}
              loading={isSaving}
            />
          )}
        </FadedBottomBar>
      )}
    </>
  )
}
