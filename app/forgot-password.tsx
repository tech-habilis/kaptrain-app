import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Input from "@/components/input";
import Text from "@/components/text";
import { useSession } from "@/contexts/auth-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "validation.emailRequired").email("validation.emailInvalid"),
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { resetPassword, isResettingPassword } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const issue = result.error.issues[0];
      setError(t(issue.message));
      return false;
    }

    setError("");
    return true;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      resetPassword(email);
    }
  };

  return (
    <View className="py-safe px-4 flex-1 bg-white">
      <StatusBar style="dark" />
      <Pressable className="py-4" onPress={router.back}>
        <IcArrowLeft />
      </Pressable>
      <Text className="text-2xl text-secondary font-bold mt-2">
        forgotPassword.title
      </Text>
      <Text className="text-subtleText mt-1">
        forgotPassword.description
      </Text>

      <Input
        label="signIn.emailAddress"
        placeholder="signIn.exampleEmail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError("");
        }}
        className="mt-8"
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />

      <View className="grow" />

      <Button
        className="mb-6"
        text="common.next"
        disabled={!email || isResettingPassword}
        onPress={handleResetPassword}
        loading={isResettingPassword}
      />
    </View>
  );
}
