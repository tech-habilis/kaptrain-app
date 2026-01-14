import { View, Pressable, Text as RawText } from "react-native";
import Text from "@/components/text";
import { useTabataTimer } from "@/hooks/use-tabata-timer";
import IcPause from "./icons/pause";
import { IcReset } from "./icons/repeat";
import { TabataTheme } from "@/constants/tabata-theme";
import CircularProgress from "./charts/circular-progress";
import IcClose from "./icons/close";
import { useState } from "react";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import IcPlay from "./icons/play";

interface TabataWidgetProps {
  /**
   * Effort duration in seconds
   */
  effortSeconds?: number;

  /**
   * Rest duration in seconds
   */
  restSeconds?: number;

  /**
   * Total number of rounds
   */
  totalRounds?: number;

  /**
   * Callback when timer starts running
   */
  onStarted?: () => void;

  /**
   * Callback when timer completes
   */
  onCompleted?: () => void;

  /**
   * Additional className for styling
   */
  className?: string;
}

export default function TabataWidget({
  effortSeconds = 20,
  restSeconds = 10,
  totalRounds = 8,
  onStarted,
  onCompleted,
  className = "",
}: TabataWidgetProps) {
  const {
    state,
    phase,
    round,
    formattedMinutes,
    formattedSeconds,
    start,
    pause,
    resume,
    reset,
    remainingSeconds,
    totalSeconds,
    isPaused,
  } = useTabataTimer({
    effortSeconds,
    restSeconds,
    totalRounds,
    onStarted,
    onCompleted,
  });

  // Get theme colors based on phase
  const phaseTheme = TabataTheme[phase];
  const [show, setShow] = useState(true);
  const close = () => setShow(false);

  if (!show) return <View className="pt-safe" />;

  return (
    <Pressable
      onPress={() => router.push(ROUTE.TIMER_EXPANDED)}
      className="w-full pt-safe mb-4"
      style={{
        backgroundColor: phaseTheme.backgroundColor,
      }}
    >
      <View className="p-3 pt-0 flex-row items-center">
        {["running", "paused"].includes(state) && (
          <CircularProgress
            backgroundColor={phaseTheme.backgroundColor}
            progressColor={phaseTheme.progressColor}
            current={remainingSeconds}
            total={totalSeconds}
            size={32}
            strokeWidth={5}
            textContainerClassName="hidden"
          />
        )}

        <View className="flex-row justify-center items-center ml-3">
          <Text className="text-secondary font-semibold text-[32px]">
            {formattedMinutes}
          </Text>
          <RawText className="text-secondary font-semibold text-[32px]">
            :
          </RawText>
          <Text className="text-secondary font-semibold text-[32px]">
            {formattedSeconds}
          </Text>
        </View>

        <Text className="text-sm font-medium text-accent ml-2 flex-1">
          {`Tours ${round + 1}/${totalRounds}`}
        </Text>

        <View className="flex-row items-center gap-1.5">
          <Pressable onPress={reset}>
            <IcReset />
          </Pressable>
          <Pressable
            onPress={state === "default" ? start : isPaused ? resume : pause}
          >
            {isPaused ? <IcPause size={32} /> : <IcPlay size={32} />}
          </Pressable>
          <Pressable onPress={close}>
            <IcClose size={32} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
