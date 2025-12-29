import Button, { ButtonLink } from "@/components/button";
import IcKaptrain from "@/components/icons/kaptrain";
import { appName } from "@/constants/misc";
import { useSession } from "@/contexts/auth-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, ImageBackground, Text as RawText } from "react-native";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import Input from "@/components/input";
import IcEye from "@/components/icons/eye";
import IcEyeOff from "@/components/icons/eye-off";
import { Trans } from "react-i18next";
import { Link, useRouter } from "expo-router";

export default function SignIn() {
  const { signUpWithEmail, isLoggedIn: isSigningUp } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

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
            <ButtonLink
              href={ROUTE.SIGN_IN}
              size="small"
              text="signUp.login"
            />
          </View>
        </View>
      </ImageBackground>

      <View className="flex flex-col w-full pt-8 px-4 flex-1 pb-safe">
        <Input
          label="signIn.emailAddress"
          value={email}
          onChangeText={setEmail}
          placeholder="signIn.exampleEmail"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="signUp.createPassword"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="common.password"
          className="mt-6"
          rightIcon={
            showPassword ? <IcEye size={24} /> : <IcEyeOff size={24} />
          }
          onRightIconPress={() => setShowPassword((prev) => !prev)}
          keyboardType={showPassword ? "visible-password" : "default"}
        />
        <Input
          label="signUp.confirmPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          placeholder="signUp.confirmPasswordPlaceholder"
          className="mt-6"
          rightIcon={
            showConfirmPassword ? <IcEye size={24} /> : <IcEyeOff size={24} />
          }
          onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
          keyboardType={showConfirmPassword ? "visible-password" : "default"}
        />

        <View className="grow" />

        <RawText>
          <Trans i18nKey="signUp.agreeByCreatingAccount">
            By creating an account, you agree to the
            <Link className="font-bold text-secondary" href="https://kaptrain.com">Terms of Use</Link>
            and our
            <Link className="font-bold text-secondary" href="https://kaptrain.com">data processing policy.</Link>
          </Trans>
        </RawText>

        <Button
          onPress={() => {
            // signUpWithEmail({
            //   name: "",
            //   email,
            //   password,
            //   confirmPassword,
            // });
            router.push(ROUTE.VERIFY_EMAIL)
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
