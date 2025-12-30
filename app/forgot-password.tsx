import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

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
        onChangeText={setEmail}
        className="mt-8"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="grow" />

      <Button
        className="mb-6"
        text="common.next"
        disabled={!email}
        onPress={() => {
          router.replace(ROUTE.PASSWORD_RESET_SENT);
        }}
      />
    </View>
  );
}
