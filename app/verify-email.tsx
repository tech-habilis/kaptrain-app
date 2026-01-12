import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text as RawText, Pressable } from "react-native";
import { cn } from "tailwind-variants";
import { OTPInput } from "input-otp-native";
import { useSession } from "@/contexts/auth-context";

const OTP_LENGTH = 6;
const OTP_RESEND_DELAY = 60; // 60 seconds

function Box({
  isActive,
  char,
  onActive,
}: {
  isActive: boolean;
  char: string | null;
  onActive: () => void;
}) {
  useEffect(() => {
    if (isActive) {
      onActive();
    }
  }, [isActive, onActive]);

  return (
    <View
      className={cn(
        "border-2 justify-center items-center rounded-lg size-13",
        isActive ? "border-secondary" : "border-stroke",
      )}
    >
      <Text className={cn("text-[24px] text-secondary font-bold")}>
        {char ?? ""}
      </Text>
    </View>
  );
}

export default function VerifyEmail() {
  const { verifyEmail } = useSession();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(OTP_RESEND_DELAY);

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
  const [activeIndex, setActiveIndex] = useState(0);

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
        verifyEmail.checkMyEmail
      </Text>
      <Text className="text-subtleText mt-1">verifyEmail.codeSentToEmail</Text>
      <Text className="text-text font-medium">{email}</Text>

      {/* otp boxes */}
      <OTPInput
        returnKeyType={activeIndex === OTP_LENGTH - 1 ? 'done' : undefined}
        value={otp}
        onChange={setOtp}
        maxLength={OTP_LENGTH}
        render={({ slots }) => (
          <View className="flex-row gap-2 mt-8">
            {slots.map((slot, index) => (
              <Box
                key={index}
                isActive={slot.isActive}
                char={slot.char}
                onActive={() => setActiveIndex(index)}
              />
            ))}
          </View>
        )}
      />

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
        onPress={() => verifyEmail(email, otp)}
        className="mb-6 mt-6"
        disabled={otp.length !== OTP_LENGTH}
      />
    </View>
  );
}
