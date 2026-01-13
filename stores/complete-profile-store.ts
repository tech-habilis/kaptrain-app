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

interface CompleteProfileState {
  currentStep: number;
  formData: CompleteProfileFormData;
  errors: Partial<Record<keyof CompleteProfileFormData, string>>;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStep1: (data: Partial<Step1FormData>) => void;
  updateStep2: (data: Partial<Step2FormData>) => void;
  updateStep3: (data: Partial<Step3FormData>) => void;
  updateStep4: (data: Partial<Step4FormData>) => void;
  updateStep5: (data: Partial<Step5FormData>) => void;
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
  }),
}));
