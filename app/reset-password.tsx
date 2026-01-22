import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import { PasswordInput } from "@/components/input";
import Text from "@/components/text";
import { useSession } from "@/contexts/auth-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/toast";
import { supabase, supabaseUtils } from "@/utilities/supabase";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/utilities/validation/schema";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { updatePassword, isUpdatingPassword, setSession } = useSession();
  const params = useLocalSearchParams<{ token?: string; type?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  // Handle deep link from email with recovery token
  useEffect(() => {
    const verifyRecoveryToken = async () => {
      const { token, type } = params;

      if (token && type === "recovery") {
        setIsVerifyingToken(true);
        const result = await supabase.auth.verifyOtp({
          token,
          type: "recovery",
        });

        if (result.error) {
          toast.error(result.error.message);
          router.back();
        } else {
          setSession(supabaseUtils.toLocalSession(result.data.session));
          toast.success("Token verified successfully");
        }
        setIsVerifyingToken(false);
      }
    };

    verifyRecoveryToken();
  }, [params, setSession]);

  const validateForm = () => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> =
        {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ResetPasswordFormData] =
            t(issue.message);
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleUpdatePassword = () => {
    if (validateForm()) {
      updatePassword(password);
    }
  };

  // Show loading state while verifying the recovery token
  if (isVerifyingToken) {
    return (
      <View className="py-safe px-4 flex-1 bg-white justify-center items-center">
        <StatusBar style="dark" />
        <Text className="text-secondary font-medium">Verifying token...</Text>
      </View>
    );
  }

  return (
    <View className="py-safe px-4 flex-1 bg-white">
      <StatusBar style="dark" />
      <Pressable className="py-4" onPress={router.back}>
        <IcArrowLeft />
      </Pressable>
      <Text className="text-2xl text-secondary font-bold mt-2">
        resetPassword.title
      </Text>
      <Text className="text-subtleText mt-1">
        resetPassword.description
      </Text>

      <PasswordInput
        label="resetPassword.newPassword"
        placeholder="resetPassword.newPasswordPlaceholder"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        className="mt-8"
        error={errors.password}
      />

      <PasswordInput
        label="signUp.confirmPassword"
        placeholder="signUp.confirmPasswordPlaceholder"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        className="mt-6"
        error={errors.confirmPassword}
      />

      <View className="grow" />

      <Button
        className="mb-6"
        text="common.verify"
        disabled={!password || !confirmPassword || isUpdatingPassword}
        onPress={handleUpdatePassword}
        loading={isUpdatingPassword}
      />
    </View>
  );
}
