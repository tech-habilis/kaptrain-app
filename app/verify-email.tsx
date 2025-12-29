import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text as RawText } from "react-native";
import { cn } from "tailwind-variants";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["8", "2", "2", ""]);
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

  const email = "example@example.com";
  const OTP_LENGTH = otp.length;
  const activeIndex = OTP_LENGTH - 1;

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
    <View className="py-safe px-4 flex-1">
      <StatusBar style="dark" />
      <View className="py-4">
        <IcArrowLeft />
      </View>
      <Text className="text-2xl text-secondary font-bold mt-2">
        verifyEmail.checkMyEmail
      </Text>
      <Text className="text-subtleText mt-1">verifyEmail.codeSentToEmail</Text>
      <Text className="text-text font-medium">{email}</Text>

      {/* otp boxes */}
      <View className="flex-row gap-2 mt-8">
        {otp.map((value, index) => (
          <View
            key={index}
            className={cn(
              "border-2 size-20 justify-center items-center rounded-lg",
              index === activeIndex ? "border-secondary" : "border-stroke",
            )}
          >
            <Text className={cn("text-[32px] text-secondary font-bold")}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-8 gap-1">
        <Text className="text-subtleText">verifyEmail.didntReceiveCode</Text>
        <View className="flex-row gap-2">
          <Text className="text-secondary font-semibold">
            verifyEmail.resendCode
          </Text>
          <RawText className="text-text">{formattedCountdown}</RawText>
        </View>
      </View>

      <View className="grow" />

      <Button
        text="common.verify"
        onPress={() => {
          router.dismissAll();
          router.replace(ROUTE.EMAIL_VERIFIED);
        }}
        className="mb-6"
      />
    </View>
  );
}
