import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import { PasswordInput } from "@/components/input";
import { useState } from "react";
import { View } from "react-native";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/utilities/validation/schema";
import { useTranslation } from "react-i18next";

export default function ContactSupport() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});

  const validateForm = () => {
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> =
        {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ChangePasswordFormData] =
            t(issue.message);
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  return (
    <BasicScreen
      title="Modifier mon mot de passe"
      description="Pour sécuriser ton compte, choisis un mot de passe fort et unique. Tu peux le changer ici à tout moment."
    >
      <View className="pt-6 px-4 gap-8 flex-1 pb-safe">
        <PasswordInput
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            if (errors.currentPassword)
              setErrors((prev) => ({ ...prev, currentPassword: undefined }));
          }}
          label="Mot de passe actuel"
          placeholder="Écris ton mot de passe actuel"
          error={errors.currentPassword}
        />
        <PasswordInput
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword)
              setErrors((prev) => ({ ...prev, newPassword: undefined }));
          }}
          label="Crée un nouveau mot de passe"
          placeholder="Au moins 8 caractères"
          error={errors.newPassword}
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          label="Confirme ton mot de passe"
          placeholder="Répéte le mot de passe"
          error={errors.confirmPassword}
        />

        <View className="grow" />

        <Button
          onPress={() => {
            if (validateForm()) {
              // Handle password update logic here
              console.log("Password updated");
            }
          }}
          text="Mettre à jour mon mot de passe"
          className="mb-6"
          disabled={
            currentPassword.length === 0 ||
            newPassword.length === 0 ||
            confirmPassword.length === 0
          }
        />
      </View>
    </BasicScreen>
  );
}
