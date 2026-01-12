import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { useSession } from "@/contexts/auth-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, View, Text as RawText } from "react-native";
import { OTPInput } from "input-otp-native";
import cn from "@/utilities/cn";
import Config from "@/constants/config";

function Box({ isActive, char }: { isActive: boolean; char: string | null }) {
  return (
    <View
      className={cn(
        "border-2 size-12 justify-center items-center rounded-lg",
        isActive ? "border-secondary" : "border-stroke",
      )}
    >
      <Text className={cn("text-[32px] text-secondary font-bold")}>
        {char ?? ""}
      </Text>
    </View>
  );
}

export default function PasswordResetSent() {
  const { verifyPasswordResetOtp } = useSession();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "";

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(Config.OTP_RESEND_DELAY);

  const countdownRef = useRef<number | null>(null);
  const isVerifyingRef = useRef(false);

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

  // Auto-verify when OTP is complete (use ref to prevent multiple calls)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (otp.length === Config.OTP_LENGTH && !isVerifyingRef.current) {
      isVerifyingRef.current = true;
      verifyPasswordResetOtp(email, otp).finally(() => {
        isVerifyingRef.current = false;
      });
    }
  }, [otp, email]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
      <RawText className="text-secondary font-medium"><Text className="text-secondary font-medium">{email || "signIn.exampleEmail"}</Text>.</RawText>

      {/* otp boxes */}
      <OTPInput
        value={otp}
        onChange={setOtp}
        maxLength={Config.OTP_LENGTH}
        render={({ slots }) => (
          <View className="flex-row gap-2 mt-8">
            {slots.map((slot, index) => (
              <Box key={index} isActive={slot.isActive} char={slot.char} />
            ))}
          </View>
        )}
      />

      <View className="mt-8 gap-4">
        <Text className="text-subtleText">passwordResetSent.didntReceiveEmail</Text>
        <View className="flex-row gap-2">
          <Text className="text-secondary font-semibold">
            verifyEmail.resendCode
          </Text>
          <RawText className="text-text">{formattedCountdown}</RawText>
        </View>
      </View>
    </View>
  );
}
