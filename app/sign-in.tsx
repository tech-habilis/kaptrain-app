import Button, { ButtonLink } from "@/components/button";
import IcKaptrain from "@/components/icons/kaptrain";
import Input from "@/components/input";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, ImageBackground } from "react-native";
import Text from "@/components/text";
import IcGoogle from "@/components/icons/google";
import IcApple from "@/components/icons/apple";

export default function SignIn() {
  const {
    canSignInWithApple,
    signInWithApple,
    signInWithGoogle,
    signInWithEmail,
    loggingInWith,
    isLoggingIn,
  } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="w-full h-full flex bg-white">
      <ImageBackground source={require("../assets/images/onboarding-hero.png")}>
        <StatusBar style="light" />
        <View className="px-4 pb-6 pt-2">
          <View className="flex flex-row gap-[4.5px] items-center pt-safe">
            <IcKaptrain size={18} />
            <Text className="text-white text-lg font-bold">KAPTRAIN</Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-3">
            signIn.loginToYourAccount
          </Text>
          <View className="flex flex-row items-center gap-1.5 mt-4">
            <Text className="text-white text-sm">
              signIn.youDontHaveAnAccount
            </Text>
            <ButtonLink
              href={ROUTE.SIGN_UP}
              size="small"
              text="signIn.signUp"
            />
          </View>
        </View>
      </ImageBackground>

      <View className="flex flex-col w-full pt-8 px-4">
        <Input
          label="signIn.emailAddress"
          value={email}
          onChangeText={setEmail}
          placeholder="signIn.exampleEmail"
          autoCapitalize="none"
        />
        <Input
          label="common.password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="common.password"
          className="mt-6"
        />
        <ButtonLink
          href={ROUTE.FORGOT_PASSWORD}
          size="small"
          text="signIn.forgotPassword"
          className="self-end mt-2"
          textClassName="text-text"
        />
        <Button
          onPress={() =>
            signInWithEmail({
              email,
              password,
            })
          }
          disabled={isLoggingIn}
          text={
            loggingInWith === "email" ? "signIn.signingIn" : "signIn.signIn"
          }
          className="mt-8"
          loading={loggingInWith === 'email'}
        />
      </View>

      <View className="flex flex-row items-center gap-2.5 mx-4 mt-6">
        <View className="bg-stroke h-px flex-1" />
        <Text className="text-subtleText text-sm">signIn.orConnectWith</Text>
        <View className="bg-stroke h-px flex-1" />
      </View>

      <View className="flex flex-row gap-4 items-center justify-around mt-5.5 mx-4">
        <Button
          onPress={signInWithGoogle}
          text="Google"
          type="secondaryV2"
          className="flex-1"
          leftIcon={<IcGoogle size={20} />}
        />
        {canSignInWithApple && (
          <Button
            onPress={signInWithApple}
            text="Apple"
            type="secondaryV2"
            className="flex-1"
            leftIcon={<IcApple size={20} />}
          />
        )}
      </View>
    </View>
  );
}
