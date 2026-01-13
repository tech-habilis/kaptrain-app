import { create } from "zustand";
import type {
  CompleteProfileFormData,
  Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  Step5FormData,
} from "@/utilities/validation/complete-profile-schema";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "@/utilities/validation/complete-profile-schema";
import { updateUserProfile, getUserProfile } from "@/utilities/supabase/profile";
import { toast } from "@/components/toast";

interface CompleteProfileState {
  currentStep: number;
  formData: CompleteProfileFormData;
  errors: Partial<Record<keyof CompleteProfileFormData, string>>;
  isSaving: boolean;
  isLoading: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStep1: (data: Partial<Step1FormData>) => void;
  updateStep2: (data: Partial<Step2FormData>) => void;
  updateStep3: (data: Partial<Step3FormData>) => void;
  updateStep4: (data: Partial<Step4FormData>) => void;
  updateStep5: (data: Partial<Step5FormData>) => void;
  saveStep: (step: number, userId: string) => Promise<boolean>;
  loadProfileData: (userId: string) => Promise<void>;
  validateStep: (step: number) => boolean;
  reset: () => void;
}

const initialState: CompleteProfileFormData = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  weight: undefined,
  preferNotToAnswer: false,
  sportLevel: "",
  selectedSports: [],
  invitationCode: "",
};

export const useCompleteProfileStore = create<CompleteProfileState>((set, get) => ({
  currentStep: 1,
  formData: initialState,
  errors: {},
  isSaving: false,
  isLoading: false,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 5) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateStep1: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {},
    }));
  },

  updateStep2: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {},
    }));
  },

  updateStep3: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {},
    }));
  },

  updateStep4: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {},
    }));
  },

  updateStep5: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {},
    }));
  },

  loadProfileData: async (userId) => {
    try {
      set({ isLoading: true });

      const profile = await getUserProfile(userId);

      // Map database values back to form values
      const mappedData: Partial<CompleteProfileFormData> = {};

      // Step 1: Personal info
      if (profile.first_name) mappedData.firstName = profile.first_name;
      if (profile.last_name) mappedData.lastName = profile.last_name;
      if (profile.date_of_birth) mappedData.birthDate = profile.date_of_birth;
      if (profile.gender) {
        // Map database gender enum to translation keys
        const genderMap: Record<string, string> = {
          "female": "completeProfile.step1.genderFemale",
          "male": "completeProfile.step1.genderMale",
          "nonbinary": "completeProfile.step1.genderNonBinary",
        };
        mappedData.gender = genderMap[profile.gender] || "";
      }

      // Step 2: Weight
      if (profile.weight !== null) {
        mappedData.weight = profile.weight;
        mappedData.preferNotToAnswer = false;
      }

      // Step 3: Sport level
      if (profile.sport_level) {
        // Map database sport level to translation keys
        const sportLevelMap: Record<string, string> = {
          "beginner": "completeProfile.step3.levelBeginner",
          "intermediate": "completeProfile.step3.levelIntermediate",
          "advanced": "completeProfile.step3.levelAdvanced",
          "confirmed": "completeProfile.step3.levelConfirmed",
          "expert": "completeProfile.step3.levelExpert",
        };
        mappedData.sportLevel = sportLevelMap[profile.sport_level] || "";
      }

      // Step 4: Selected sports from preferences JSON
      if (profile.preferences && typeof profile.preferences === "object") {
        const prefs = profile.preferences as Record<string, unknown>;
        if (Array.isArray(prefs.selectedSports)) {
          mappedData.selectedSports = prefs.selectedSports as string[];
        }
      }

      set((state) => ({
        formData: { ...state.formData, ...mappedData },
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast.error(error.message || "Failed to load profile");
      set({ isLoading: false });
    }
  },

  saveStep: async (step, userId) => {
    const { formData } = get();

    try {
      set({ isSaving: true });

      // Map form data to database schema
      const updates: Record<string, any> = {};

      // Step 1: Personal info
      if (step >= 1 && formData.firstName && formData.lastName) {
        updates.first_name = formData.firstName;
        updates.last_name = formData.lastName;
      }
      if (step >= 1 && formData.birthDate) {
        updates.date_of_birth = formData.birthDate;
      }
      if (step >= 1 && formData.gender) {
        // Map gender values to database enum
        const genderMap: Record<string, string> = {
          "completeProfile.step1.genderFemale": "female",
          "completeProfile.step1.genderMale": "male",
          "completeProfile.step1.genderNonBinary": "nonbinary",
        };
        updates.gender = genderMap[formData.gender] || "prefer_not_to_say";
      }

      // Step 2: Weight (optional)
      if (step >= 2 && formData.weight !== undefined && !formData.preferNotToAnswer) {
        updates.weight = formData.weight;
      } else if (step >= 2 && formData.preferNotToAnswer) {
        updates.weight = null;
      }

      // Step 3: Sport level
      if (step >= 3 && formData.sportLevel) {
        // Map sport level translation keys to database values
        const sportLevelMap: Record<string, string> = {
          "completeProfile.step3.levelBeginner": "beginner",
          "completeProfile.step3.levelIntermediate": "intermediate",
          "completeProfile.step3.levelAdvanced": "advanced",
          "completeProfile.step3.levelConfirmed": "confirmed",
          "completeProfile.step3.levelExpert": "expert",
        };
        updates.sport_level = sportLevelMap[formData.sportLevel] || null;
      }

      // Step 4: Selected sports (store in preferences JSON)
      if (step >= 4 && formData.selectedSports && formData.selectedSports.length > 0) {
        updates.preferences = {
          selectedSports: formData.selectedSports,
        };
      }

      // Step 5: Coach invitation - skipped for now, feature coming soon

      // Mark onboarding as completed when finishing all steps
      if (step === 5) {
        updates.onboarding_date = new Date().toISOString();
      }

      // Only update if we have data to save
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(userId, updates);
      }

      set({ isSaving: false });
      return true;
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
      set({ isSaving: false });
      return false;
    }
  },

  validateStep: (step) => {
    const { formData } = get();
    let schema;
    let dataToValidate;

    switch (step) {
      case 1:
        schema = step1Schema;
        dataToValidate = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          gender: formData.gender,
        };
        break;
      case 2:
        schema = step2Schema;
        dataToValidate = {
          weight: formData.weight,
          preferNotToAnswer: formData.preferNotToAnswer,
        };
        break;
      case 3:
        schema = step3Schema;
        dataToValidate = {
          sportLevel: formData.sportLevel,
        };
        break;
      case 4:
        schema = step4Schema;
        dataToValidate = {
          selectedSports: formData.selectedSports,
        };
        break;
      case 5:
        schema = step5Schema;
        dataToValidate = {
          invitationCode: formData.invitationCode,
        };
        break;
      default:
        return true;
    }

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Partial<Record<keyof CompleteProfileFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CompleteProfileFormData;
        newErrors[key] = issue.message;
      });
      set({ errors: newErrors });
      return false;
    }

    set({ errors: {} });
    return true;
  },

  reset: () => ({
    currentStep: 1,
    formData: initialState,
    errors: {},
    isSaving: false,
    isLoading: false,
  }),
}));
