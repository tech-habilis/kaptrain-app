import { View, Pressable, Text as RawText } from "react-native";
import Text from "@/components/text";
import { useWorkoutTimer, TimerType } from "@/hooks/use-workout-timer";
import IcPause from "./icons/pause";
import { IcReset } from "./icons/repeat";
import { TabataTheme } from "@/constants/tabata-theme";
import CircularProgress from "./charts/circular-progress";
import IcClose from "./icons/close";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import IcPlay from "./icons/play";
import { useTimerStore } from "@/stores/timer-store";

// Timer type labels in French
const TIMER_LABELS: Record<TimerType, string> = {
  stopwatch: "Chronomètre",
  countdown: "Minuteur",
  emom: "EMOM",
  amrap: "AMRAP",
  tabata: "Tabata",
  custom: "Personnalisé",
};

function TimerWidgetContent() {
  const timerConfig = useTimerStore((state) => state.timerConfig);
  const showWidget = useTimerStore((state) => state.showWidget);
  const setShowWidget = useTimerStore((state) => state.setShowWidget);

  // Get timer config with defaults
  const timerType: TimerType = timerConfig?.timerType || "tabata";
  const totalRounds = timerConfig?.rounds || 8;
  const effortSeconds = timerConfig?.effortSeconds || 20;
  const restSeconds = timerConfig?.restSeconds || 10;
  const durationSeconds = timerConfig?.durationSeconds || 60;

  const {
    state,
    phase,
    round,
    formattedMinutes,
    formattedSeconds,
    pause,
    resume,
    reset,
    remainingSeconds,
    totalSeconds,
    isPaused,
    roundsCompleted,
    startImmediately,
  } = useWorkoutTimer({
    timerType,
    effortSeconds,
    restSeconds,
    durationSeconds,
    totalRounds,
    initialState: "default",
  });

  // Don't render if no timer config or widget is hidden
  if (!timerConfig || !showWidget) return null;

  // Get theme colors based on phase
  const getTheme = () => {
    if (state === "default") {
      return TabataTheme.default;
    }
    // For interval timers in rest phase, use rest theme
    if (
      (timerType === "tabata" ||
        timerType === "custom" ||
        timerType === "emom") &&
      phase === "rest"
    ) {
      return TabataTheme.rest;
    }
    // All other running states use effort theme
    return TabataTheme.effort;
  };

  const theme = getTheme();
  const close = () => {
    setShowWidget(false);
  };

  const handleReset = () => {
    reset();
    setShowWidget(true);
  };

  const handleStart = () => {
    setShowWidget(true);
    startImmediately();
  };

  // Get display label based on timer type
  const getTimerLabel = (): string => {
    return TIMER_LABELS[timerType];
  };

  // Get round counter text
  const getRoundText = (): string | null => {
    if (timerType === "amrap") {
      return `${roundsCompleted} tours`;
    }
    if (timerType === "stopwatch" || timerType === "countdown") {
      return null;
    }
    return `Tours ${round + 1}/${totalRounds}`;
  };

  const roundText = getRoundText();

  return (
    <Pressable
      onPress={() => router.push(ROUTE.TIMER_EXPANDED)}
      className="w-full pt-safe"
      style={{
        backgroundColor: theme.cardBackgroundColor,
      }}
    >
      <View className="p-3 pt-0 flex-row items-center">
        {/* Show circular progress for interval timers */}
        {["running", "paused"].includes(state) &&
          (timerType === "tabata" ||
            timerType === "custom" ||
            timerType === "emom") && (
            <CircularProgress
              backgroundColor={theme.backgroundColor}
              progressColor={theme.progressColor}
              current={remainingSeconds}
              total={totalSeconds}
              size={32}
              strokeWidth={5}
              textContainerClassName="hidden"
            />
          )}

        {/* Timer display */}
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

        {/* Round counter or timer type label */}
        {roundText ? (
          <Text className="text-sm font-medium text-accent ml-2 flex-1">
            {roundText}
          </Text>
        ) : (
          <Text className="text-sm font-medium text-accent ml-2 flex-1">
            {getTimerLabel()}
          </Text>
        )}

        {/* Action buttons */}
        <View className="flex-row items-center gap-1.5">
          <Pressable onPress={handleReset}>
            <IcReset />
          </Pressable>
          <Pressable
            onPress={
              state === "default" ? handleStart : isPaused ? resume : pause
            }
          >
            {!isPaused && state !== "default" ? (
              <IcPause size={32} />
            ) : (
              <IcPlay size={32} />
            )}
          </Pressable>
          <Pressable onPress={close}>
            <IcClose size={32} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function TimerWidget() {
  const timerConfig = useTimerStore((state) => state.timerConfig);
  const showWidget = useTimerStore((state) => state.showWidget);

  if (!timerConfig || !showWidget) return null;

  // Use timer ID as key to force remount when timer is recreated
  return <TimerWidgetContent key={timerConfig.id} />;
}
