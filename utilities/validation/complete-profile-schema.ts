import { z } from "zod";
import { phoneSchema } from "./schema";

// Step 1: Personal Information
export const step1Schema = z.object({
  avatarUrl: z.string().optional(),
  firstName: z.string().min(1, "validation.firstNameRequired"),
  lastName: z.string().min(1, "validation.lastNameRequired"),
  birthDate: z.string().min(1, "validation.birthDateRequired"),
  gender: z.string().min(1, "validation.genderRequired"),
  phone: phoneSchema,
});

// Step 2: Weight
export const step2Schema = z.object({
  weight: z.number().positive("validation.weightRequired").optional(),
  preferNotToAnswer: z.boolean().optional(),
});

// Step 3: Sport Level
export const step3Schema = z.object({
  sportLevel: z.string().min(1, "validation.sportLevelRequired"),
});

// Step 4: Sports Selection
export const step4Schema = z.object({
  selectedSports: z
    .array(z.string())
    .min(1, "validation.atLeastOneSportRequired")
    .max(5, "validation.maxFiveSports"),
});

// Step 5: Invitation Code
export const step5Schema = z.object({
  invitationCode: z.string().optional(),
});

// Complete Profile Schema (all steps combined)
export const completeProfileSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
