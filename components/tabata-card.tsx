import { View, Pressable, Text as RawText } from "react-native";
import Text from "@/components/text";
import Button from "@/components/button";
import { ColorConst } from "@/constants/theme";
import IcClose from "@/components/icons/close";
import { clsx } from "clsx";
import { BlurView } from "expo-blur";
import Tabs from "./tabs";
import { IcReset } from "./icons/repeat";
import IcPause from "./icons/pause";
import CircularProgress from "./charts/circular-progress";
import { useTabataTimer, type TimerState } from "@/hooks/use-tabata-timer";
import { TabataTheme } from "@/constants/tabata-theme";

interface TabataCardProps {
  /**
   * Timer type label (e.g., "Tabata")
   */
  timerType?: string;

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
   * Current round (0-based)
   */
  currentRound?: number;

  /**
   * Current countdown time display (MM:SS format)
   */
  countdownTime?: string;

  /**
   * State of the timer
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

export default function TabataCard({
  timerType = "Tabata",
  effortSeconds = 20,
  restSeconds = 10,
  totalRounds = 8,
  currentRound = 0,
  size = "large",
  onClose,
  onModify,
  onStarted,
  initialState = "default",
  className = "",
}: TabataCardProps) {
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
  } = useTabataTimer({
    effortSeconds,
    restSeconds,
    totalRounds,
    initialRound: currentRound,
    initialState,
    onStarted,
  });

  const phaseTabs = [`Effort ${effortSeconds}s`, `Rest ${restSeconds}s`];
  const currentPhaseTab = phaseTabs[phase === "effort" ? 0 : 1];

  // Get theme colors based on phase
  const phaseTheme = TabataTheme[phase];

  return (
    <View
      className={clsx(
        "border-2 rounded-2xl p-4 relative overflow-hidden",
        size === "large" ? "gap-4" : "gap-3",
        className,
      )}
      style={{
        backgroundColor:
          ["paused", "running"].includes(state)
            ? phaseTheme.cardBackgroundColor
            : state === "completed"
              ? TabataTheme.completed.backgroundColor
              : TabataTheme.default.backgroundColor,
        borderColor:
          ["paused", "running"].includes(state)
            ? phaseTheme.borderColor
            : state === "completed"
              ? TabataTheme.completed.borderColor
              : TabataTheme.default.borderColor,
      }}
    >
      {/* Header Section */}
      <View className="gap-2">
        {/* Title Row */}
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-text">{timerType}</Text>
          {onClose && (
            <Pressable
              className="w-6 h-6 items-center justify-center"
              onPress={onClose}
            >
              <IcClose size={24} color={ColorConst.text} />
            </Pressable>
          )}
        </View>

        {["running", "paused"].includes(state) ? (
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
        ) : (
          <View className="flex-row gap-2">
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
          </View>
        )}
      </View>

      {/* Timer Display Section */}
      <View className="items-center gap-4 flex-row justify-center">
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

        {/* Round Counter */}
        <Text className="text-sm font-medium text-accent">
          {`Tours ${round + 1}/${totalRounds}`}
        </Text>
      </View>

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
              ? undefined
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
    </View>
  );
}
