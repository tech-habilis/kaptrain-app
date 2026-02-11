import { z } from "zod";
import { phoneSchema } from "./schema";

// Helper function to validate number strings (supports both . and , as decimal separator)
const numberString = () =>
  z
    .string()
    .min(1, "validation.required")
    .refine(
      (val) => {
        const num = parseFloat(val.replace(",", "."));
        return !isNaN(num) && num > 0;
      },
      { message: "validation.mustBeValidNumber" },
    );

// Edit Profile Schema
export const editProfileSchema = z.object({
  firstName: z.string().min(1, "validation.firstNameRequired"),
  lastName: z.string().min(1, "validation.lastNameRequired"),
  birthDate: z.string().min(1, "validation.birthDateRequired"),
  gender: z.string().min(1, "validation.genderRequired"),
  weight: numberString(),
  sportLevel: z.string().min(1, "validation.sportLevelRequired"),
  height: z.string().optional(),
  inWheelchair: z.boolean().optional(),
  phone: phoneSchema,
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
