import Button, { ButtonLink } from "@/components/button";
import IcKaptrain from "@/components/icons/kaptrain";
import { appName } from "@/constants/misc";
import { useSession } from "@/contexts/auth-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, ImageBackground, Text as RawText } from "react-native";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import Input, { PasswordInput } from "@/components/input";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "expo-router";
import {
  signUpSchema,
  type SignUpFormData,
} from "@/utilities/validation/schema";

export default function SignIn() {
  const { signUpWithEmail, isLoggedIn: isSigningUp } = useSession();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  const validateForm = () => {
    const result = signUpSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof SignUpFormData] = t(issue.message);
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  return (
    <View className="w-full h-full flex bg-white">
      <ImageBackground source={require("../assets/images/onboarding-hero.png")}>
        <StatusBar style="light" />
        <View className="px-4 pb-6 pt-2">
          <View className="flex flex-row gap-[4.5px] items-center pt-safe">
            <IcKaptrain size={18} />
            <Text className="text-white text-lg font-bold uppercase">
              {appName}
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-3">
            signUp.noAccountSignUp
          </Text>
          <View className="flex flex-row items-center gap-1.5 mt-4">
            <Text className="text-white text-sm">
              signUp.alreadyHaveAccount
            </Text>
            <ButtonLink href={ROUTE.SIGN_IN} size="small" text="signUp.login" />
          </View>
        </View>
      </ImageBackground>

      <View className="flex flex-col w-full pt-8 px-4 flex-1 pb-safe">
        <Input
          label="signIn.emailAddress"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="signIn.exampleEmail"
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <PasswordInput
          label="signUp.createPassword"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="common.password"
          className="mt-6"
          error={errors.password}
          hintText="signUp.passwordRequirements"
        />
        <PasswordInput
          label="signUp.confirmPassword"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="signUp.confirmPasswordPlaceholder"
          className="mt-6"
          error={errors.confirmPassword}
        />

        <View className="grow" />

        <RawText>
          <Trans i18nKey="signUp.agreeByCreatingAccount">
            By creating an account, you agree to the
            <Link
              className="font-bold text-secondary"
              href="https://kaptrain.com"
            >
              Terms of Use
            </Link>
            and our
            <Link
              className="font-bold text-secondary"
              href="https://kaptrain.com"
            >
              data processing policy.
            </Link>
          </Trans>
        </RawText>

        <Button
          onPress={() => {
            if (validateForm()) {
              signUpWithEmail({
                name: "",
                email,
                password,
                confirmPassword,
              });
            }
          }}
          disabled={isSigningUp}
          text="signUp.createAccount"
          className="mt-4 mb-6"
          loading={isSigningUp}
        />
      </View>
    </View>
  );
}
