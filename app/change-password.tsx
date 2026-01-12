import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import IcEye from "@/components/icons/eye";
import IcEyeOff from "@/components/icons/eye-off";
import Input, { PasswordInput } from "@/components/input";
import { useState } from "react";
import { View } from "react-native";

export default function ContactSupport() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <BasicScreen
      title="Modifier mon mot de passe"
      description="Pour sécuriser ton compte, choisis un mot de passe fort et unique. Tu peux le changer ici à tout moment."
    >
      <View className="pt-6 px-4 gap-8 flex-1 pb-safe">
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          label="Mot de passe actuel"
          placeholder="Écris ton mot de passe actuel"
        />
        <PasswordInput
          value={newPassword}
          onChangeText={setNewPassword}
          label="Crée un nouveau mot de passe"
          placeholder="Au moins 8 caractères"
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          label="Confirme ton mot de passe"
          placeholder="Répéte le mot de passe"
        />

        <View className="grow" />

        <Button
          text="Mettre à jour mon mot de passe"
          className="mb-6"
          disabled={
            password.length === 0 ||
            newPassword.length === 0 ||
            confirmPassword.length === 0
          }
        />
      </View>
    </BasicScreen>
  );
}
