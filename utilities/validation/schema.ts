import { z } from "zod";

// Phone: Numbers only with optional "+" prefix (spaces allowed for formatting), min 8 digits
export const phoneSchema = z
  .string()
  .min(1, "validation.phoneRequired")
  .refine((val) => /^\+?[\d\s]*$/.test(val), "validation.phoneNumbersOnly")
  .refine((val) => val.replace(/\s/g, "").length >= 8, "validation.phoneMinLength");

// Password: Minimum 8 characters, 1 uppercase letter, 1 number, 1 special character
export const passwordSchema = z
  .string()
  .min(1, "validation.passwordRequired")
  .min(8, "validation.passwordMinLength")
  .regex(/[A-Z]/, "validation.passwordUppercase")
  .regex(/[0-9]/, "validation.passwordNumber")
  .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial");

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "validation.emailRequired")
      .email("validation.emailInvalid"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "validation.currentPasswordRequired"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
