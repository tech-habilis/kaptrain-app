import Button from "@/components/button";
import CircularProgress from "@/components/charts/circular-progress";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPause from "@/components/icons/pause";
import { IcReset } from "@/components/icons/repeat";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { TabataTheme } from "@/constants/tabata-theme";
import { useWorkoutTimer, TimerType } from "@/hooks/use-workout-timer";
import { useTimerStore } from "@/stores/timer-store";
import { clsx } from "clsx";
import { router } from "expo-router";
import { Pressable, View, Text as RawText } from "react-native";

// Timer type labels in French
const TIMER_LABELS: Record<TimerType, string> = {
  stopwatch: "Chronomètre",
  countdown: "Minuteur",
  emom: "EMOM",
  amrap: "AMRAP",
  tabata: "Tabata",
  custom: "Personnalisé",
};

export default function TimerExpanded() {
  const { timerConfig } = useTimerStore();

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
    phaseTabs,
    currentPhaseTab,
    roundsCompleted,
    isPaused,
    startImmediately,
  } = useWorkoutTimer({
    timerType,
    effortSeconds,
    restSeconds,
    durationSeconds,
    totalRounds,
    initialState: "default",
  });

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

  const theme = getTheme() as (typeof TabataTheme)[keyof typeof TabataTheme];

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
    <View
      className="px-4 py-safe flex-1"
      style={{ backgroundColor: theme.cardBackgroundColor }}
    >
      {/* Header */}
      <View className="flex-row gap-1 items-center">
        <Pressable onPress={router.back} className="p-2">
          <IcArrowLeft />
        </Pressable>
        <Text className="text-secondary text-lg font-ls-bold">
          {getTimerLabel()}
        </Text>
      </View>

      {/* Configuration display */}
      {["running", "paused"].includes(state) ? (
        <>
          {/* Phase tabs for interval timers */}
          {(timerType === "tabata" || timerType === "custom") &&
            phaseTabs &&
            currentPhaseTab && (
              <Tabs
                tabs={phaseTabs}
                selected={currentPhaseTab}
                onSelected={() => {
                  // do nothing, tab selection is done by the timer
                }}
                selectedClassName="bg-error2"
                selectedStyle={{
                  backgroundColor: theme.tabBackgroundColor,
                }}
                textClassName="text-base text-accent font-medium"
                selectedTextClassName="text-base text-white font-bold"
                tabClassName="py-[10.5px]"
                className="mt-12"
              />
            )}
          {/* EMOM specific display */}
          {timerType === "emom" && (
            <View className="flex-row gap-2 mt-12">
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`Round ${round + 1}/${totalRounds}`}
                </Text>
              </View>
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {phase === "effort" ? "Effort" : "Repos"}
                </Text>
              </View>
            </View>
          )}
          {/* AMRAP specific display */}
          {timerType === "amrap" && (
            <View className="flex-row gap-2 mt-12">
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`${roundsCompleted} rounds`}
                </Text>
              </View>
            </View>
          )}
        </>
      ) : (
        <View className="flex-row gap-2 mt-3 flex-wrap">
          {/* Tabata/Custom configuration */}
          {(timerType === "tabata" || timerType === "custom") && (
            <>
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`Effort ${effortSeconds}s`}
                </Text>
              </View>
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">{`Repos ${restSeconds}s`}</Text>
              </View>
              <View className="bg-white border border-stroke rounded px-2 py-0.5">
                <Text className="text-sm text-accent">{`${totalRounds} tours`}</Text>
              </View>
            </>
          )}
          {/* EMOM configuration */}
          {timerType === "emom" && (
            <>
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`Effort ${effortSeconds}s`}
                </Text>
              </View>
              <View className="bg-white border border-stroke rounded px-2 py-0.5">
                <Text className="text-sm text-accent">{`${totalRounds} tours`}</Text>
              </View>
            </>
          )}
          {/* AMRAP configuration */}
          {timerType === "amrap" && (
            <View className="bg-white border rounded px-2 py-0.5 border-stroke">
              <Text className="text-sm text-accent">
                {`${Math.floor(durationSeconds / 60)} min`}
              </Text>
            </View>
          )}
          {/* Countdown configuration */}
          {timerType === "countdown" && (
            <View className="bg-white border rounded px-2 py-0.5 border-stroke">
              <Text className="text-sm text-accent">
                {`${Math.floor(durationSeconds / 60)} min`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Round counter */}
      {roundText && (
        <Text className="text-2xl font-medium text-accent mt-14">
          {roundText}
        </Text>
      )}

      {/* Timer display */}
      <View className="flex-row items-center justify-center mt-8">
        {/* Circular progress for interval timers */}
        {["running", "paused"].includes(state) &&
          (timerType === "tabata" ||
            timerType === "custom" ||
            timerType === "emom") && (
            <CircularProgress
              backgroundColor={theme.backgroundColor}
              progressColor={theme.progressColor}
              current={remainingSeconds}
              total={totalSeconds}
              size={74}
              strokeWidth={10}
              textContainerClassName="hidden"
            />
          )}

        <View className="flex-row justify-center items-center ml-3">
          <View className="w-28 items-center justify-center">
          <Text className="text-secondary font-semibold text-[80px]">
            {formattedMinutes}
          </Text>
          </View>
          <RawText className="text-secondary font-semibold text-[80px]">
            :
          </RawText>
          <View className="w-28 items-center justify-center">
          <Text className="text-secondary font-semibold text-[80px]">
            {formattedSeconds}
              </Text>
          </View>
        </View>
      </View>

      {state === "completed" && (
        <Text className="font-bold text-secondary text-2xl mt-8">
          Temps écoulé. Bien joué !
        </Text>
      )}

      <View className="grow" />

      {/* Action buttons */}
      <View
        className={clsx("flex-row gap-3 items-center mb-6", {
          "justify-center": ["running", "paused"].includes(state),
        })}
      >
        <Pressable onPress={reset} className="p-4">
          <IcReset size={32} />
        </Pressable>
        <Button
          leftIcon={!isPaused && state !== "default" ? <IcPause /> : null}
          text={
            state === "completed"
              ? "Terminer"
              : state === "running"
                ? "Pause"
                : state === "paused"
                  ? "Reprendre"
                  : "C'est parti !"
          }
          type={["running", "paused"].includes(state) ? "secondary" : "primary"}
          size="large"
          onPress={
            state === "completed"
              ? () => router.push(ROUTE.SESSION_ENDED_FORM)
              : state === "running"
                ? pause
                : state === "paused"
                  ? resume
                  : startImmediately
          }
          className={clsx("grow", {
            "bg-white border-secondary ": ["running", "paused"].includes(state),
          })}
        />
      </View>
    </View>
  );
}
