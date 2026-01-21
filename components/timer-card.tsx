import { View, Pressable, Text as RawText, TouchableOpacity } from "react-native";
import Text from "@/components/text";
import Button from "@/components/button";
import { ColorConst } from "@/constants/theme";
import IcClose from "@/components/icons/close";
import IcPlus from "@/components/icons/plus";
import IcMinus from "@/components/icons/minus";
import { clsx } from "clsx";
import { BlurView } from "expo-blur";
import Tabs from "./tabs";
import { IcReset } from "./icons/repeat";
import IcPause from "./icons/pause";
import CircularProgress from "./charts/circular-progress";
import { useWorkoutTimer, TimerState, TimerType } from "@/hooks/use-workout-timer";
import { TabataTheme } from "@/constants/tabata-theme";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";

interface TimerCardProps {
  /**
   * Timer type
   */
  timerType?: TimerType;

  /**
   * Effort duration in seconds (for tabata, custom, emom)
   */
  effortSeconds?: number;

  /**
   * Rest duration in seconds (for tabata, custom)
   */
  restSeconds?: number;

  /**
   * Total duration in seconds (for countdown, amrap)
   */
  durationSeconds?: number;

  /**
   * Total number of rounds (for tabata, custom, emom)
   */
  totalRounds?: number;

  /**
   * Current round (0-based)
   */
  currentRound?: number;

  /**
   * Initial state
   */
  initialState?: TimerState;

  /**
   * Size variant
   */
  size?: "small" | "large";

  /**
   * Callback when close button is pressed
   */
  onClose?: () => void;

  /**
   * Callback when modify button is pressed
   */
  onModify?: () => void;

  /**
   * Callback when timer starts
   */
  onStarted?: () => void;

  /**
   * Additional className for styling
   */
  className?: string;
}

export default function TimerCard({
  timerType = "tabata",
  effortSeconds = 20,
  restSeconds = 10,
  durationSeconds = 60,
  totalRounds = 8,
  currentRound = 0,
  size = "large",
  onClose,
  onModify,
  onStarted,
  initialState = "default",
  className = "",
}: TimerCardProps) {
  const {
    state,
    remainingSeconds,
    round,
    phase,
    startingIn,
    formattedMinutes,
    formattedSeconds,
    start: startTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    reset: resetTimer,
    totalSeconds,
    phaseTabs,
    currentPhaseTab,
    roundsCompleted,
    incrementRound,
    decrementRound,
  } = useWorkoutTimer({
    timerType,
    durationSeconds,
    effortSeconds,
    restSeconds,
    totalRounds,
    initialRound: currentRound,
    initialState,
    onStarted,
  });

  // Get theme colors based on phase (for interval timers)
  const phaseTheme = TabataTheme[phase];

  // Get display label for timer type
  const getTimerLabel = (): string => {
    const labels: Record<TimerType, string> = {
      stopwatch: "Chronomètre",
      countdown: "Minuteur",
      emom: "EMOM",
      amrap: "AMRAP",
      tabata: "Tabata",
      custom: "Personnalisé",
    };
    return labels[timerType];
  };

  // Get background color based on timer type and state
  const getBackgroundColor = (): string => {
    if (timerType === "stopwatch" || timerType === "countdown" || timerType === "amrap") {
      return state === "running" || state === "paused"
        ? "#FFFFFF"
        : TabataTheme.default.backgroundColor;
    }
    // Interval timers (tabata, custom, emom)
    return ["paused", "running"].includes(state)
      ? phaseTheme.cardBackgroundColor
      : TabataTheme.default.backgroundColor;
  };

  // Get border color based on timer type and state
  const getBorderColor = (): string => {
    if (timerType === "stopwatch" || timerType === "countdown" || timerType === "amrap") {
      return state === "running" || state === "paused"
        ? ColorConst.primary
        : TabataTheme.default.borderColor;
    }
    // Interval timers (tabata, custom, emom)
    return ["paused", "running"].includes(state)
      ? phaseTheme.borderColor
      : TabataTheme.default.borderColor;
  };

  return (
    <View
      className={clsx(
        "border-2 rounded-2xl p-4 relative overflow-hidden",
        size === "large" ? "gap-4" : "gap-3",
        className,
      )}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
      }}
    >
      {/* Header Section */}
      <View className="gap-2">
        {/* Title Row */}
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-text">{getTimerLabel()}</Text>
          {onClose && (
            <Pressable
              className="w-6 h-6 items-center justify-center"
              onPress={onClose}
            >
              <IcClose size={24} color={ColorConst.text} />
            </Pressable>
          )}
        </View>

        {/* Configuration display */}
        {["running", "paused"].includes(state) ? (
          <>
            {/* Phase tabs for interval timers */}
            {(timerType === "tabata" || timerType === "custom") && phaseTabs && (
              <Tabs
                tabs={phaseTabs}
                selected={currentPhaseTab}
                onSelected={() => {
                  // do nothing, tab selection is done by the timer
                }}
                selectedClassName="bg-error2"
                selectedStyle={{
                  backgroundColor: phaseTheme.tabBackgroundColor,
                }}
                textClassName="text-base text-accent font-medium"
                selectedTextClassName="text-base text-white font-bold"
                tabClassName="py-[10.5px]"
                className="mt-0"
              />
            )}
            {/* EMOM specific display */}
            {timerType === "emom" && (
              <View className="flex-row gap-2">
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {`Round ${round + 1}/${totalRounds}`}
                  </Text>
                </View>
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {phase === "effort" ? "Work" : "Rest"}
                  </Text>
                </View>
              </View>
            )}
            {/* AMRAP specific display */}
            {timerType === "amrap" && (
              <View className="flex-row gap-2">
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {`${roundsCompleted} rounds`}
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View className="flex-row gap-2 flex-wrap">
            {/* Tabata/Custom configuration */}
            {(timerType === "tabata" || timerType === "custom") && (
              <>
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {`Effort ${effortSeconds}s`}
                  </Text>
                </View>
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {`Repos ${restSeconds}s`}
                  </Text>
                </View>
                <View className="bg-white border border-stroke rounded px-2 py-0.5">
                  <Text className="text-sm text-accent">
                    {`${totalRounds} tours`}
                  </Text>
                </View>
              </>
            )}
            {/* EMOM configuration */}
            {timerType === "emom" && (
              <>
                <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                  <Text className="text-sm text-accent">
                    {`Work ${effortSeconds}s`}
                  </Text>
                </View>
                <View className="bg-white border border-stroke rounded px-2 py-0.5">
                  <Text className="text-sm text-accent">
                    {`${totalRounds} tours`}
                  </Text>
                </View>
              </>
            )}
            {/* AMRAP configuration */}
            {timerType === "amrap" && (
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`${Math.floor(durationSeconds! / 60)}:${(durationSeconds! % 60).toString().padStart(2, "0")}`}
                </Text>
              </View>
            )}
            {/* Countdown configuration */}
            {timerType === "countdown" && (
              <View className="bg-white border rounded px-2 py-0.5 border-stroke">
                <Text className="text-sm text-accent">
                  {`${Math.floor(durationSeconds! / 60)}:${(durationSeconds! % 60).toString().padStart(2, "0")}`}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Timer Display Section */}
      <View className="items-center gap-4 flex-row justify-center">
        {/* Circular progress for interval timers */}
        {["running", "paused"].includes(state) &&
          (timerType === "tabata" || timerType === "custom" || timerType === "emom") && (
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

        {/* Countdown */}
        <View className="flex-row justify-center items-center">
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

        {/* Round Counter for interval timers */}
        {timerType !== "amrap" && timerType !== "stopwatch" && timerType !== "countdown" && (
          <Text className="text-sm font-medium text-accent">
            {`Tours ${round + 1}/${totalRounds}`}
          </Text>
        )}
      </View>

      {/* AMRAP Round Counter Controls */}
      {timerType === "amrap" && state !== "completed" && (
        <View className="flex-row items-center justify-center gap-6">
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-light border-2 border-stroke items-center justify-center"
            onPress={decrementRound}
          >
            <IcMinus size={20} color={ColorConst.accent} />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-xs text-subtleText">Rounds</Text>
            <Text className="text-2xl font-bold text-text">{roundsCompleted}</Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-light border-2 border-stroke items-center justify-center"
            onPress={incrementRound}
          >
            <IcPlus size={20} color={ColorConst.accent} />
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View
        className={clsx("flex-row gap-3 items-center", {
          "justify-center": ["running", "paused"].includes(state),
        })}
      >
        {["running", "paused"].includes(state) ? (
          <Pressable onPress={resetTimer}>
            <IcReset />
          </Pressable>
        ) : (
          <Button
            text="Modifier"
            type="secondary"
            size="small"
            onPress={onModify}
            className="grow"
          />
        )}
        <Button
          leftIcon={state === "running" ? <IcPause /> : null}
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
          size="small"
          onPress={
            state === "completed"
              ? () => router.push(ROUTE.SESSION_ENDED_FORM)
              : state === "running"
                ? pauseTimer
                : state === "paused"
                  ? resumeTimer
                  : startTimer
          }
          className={clsx({
            grow: ["completed", "default"].includes(state),
            "bg-white w-32 border-secondary": ["running", "paused"].includes(
              state,
            ),
          })}
        />
      </View>

      {/* Starting countdown blur overlay (for interval timers) */}
      {timerType !== "stopwatch" &&
        timerType !== "countdown" &&
        timerType !== "amrap" && (
          <BlurView
            intensity={40}
            tint="systemThickMaterialDark"
            className={clsx("absolute inset-0 items-center justify-center", {
              hidden: state !== "starting",
            })}
          >
            <Text className="text-base text-white">Début dans...</Text>
            <Text className="text-[64px] font-bold text-white">
              {startingIn.toString()}
            </Text>
          </BlurView>
        )}
    </View>
  );
}
