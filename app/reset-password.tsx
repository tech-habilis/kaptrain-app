import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      <Input
        label="resetPassword.newPassword"
        placeholder="resetPassword.newPasswordPlaceholder"
        value={password}
        onChangeText={setPassword}
        className="mt-8"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="signUp.confirmPassword"
        placeholder="signUp.confirmPasswordPlaceholder"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="mt-8"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="grow" />

      <Button
        className="mb-6"
        text="common.verify"
        disabled={!password || !confirmPassword}
        onPress={() => {
          router.dismissAll();
          router.push(ROUTE.PASSWORD_CHANGED);
        }}
      />
    </View>
  );
}
