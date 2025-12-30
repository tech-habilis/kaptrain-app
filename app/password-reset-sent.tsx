import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, View, Text as RawText } from "react-native";

export default function PasswordResetSent() {
  const [countdown, setCountdown] = useState(418);

  const countdownRef = useRef<number | null>(null);

  // format countdown to mm:ss format
  const formattedCountdown = useMemo(() => {
    const minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [countdown]);

  const startCountDown = useCallback(() => {
    countdownRef.current = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        clearInterval(countdownRef.current!);
      }
    }, 1000);
  }, [countdown]);

  useEffect(() => {
    startCountDown();

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [startCountDown]);

  return (
    <View className="py-safe px-4 flex-1 bg-white">
      <StatusBar style="dark" />
      <Pressable className="py-4" onPress={router.back}>
        <IcArrowLeft />
      </Pressable>
      <Text className="text-2xl text-secondary font-bold mt-2">
        passwordResetSent.title
      </Text>
      <Text className="text-subtleText mt-1">
        passwordResetSent.description
      </Text>
      <RawText className="text-secondary font-medium"><Text className="text-secondary font-medium">signIn.exampleEmail</Text>.</RawText>

      <View className="mt-8 gap-4">
        <Text className="text-subtleText">passwordResetSent.didntReceiveEmail</Text>
        <View className="flex-row gap-2">
          <Text className="text-secondary font-semibold">
            verifyEmail.resendCode
          </Text>
          <Pressable onPress={() => router.push(ROUTE.RESET_PASSWORD)}>
            <RawText className="text-text">{formattedCountdown}</RawText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
