import { View, Pressable, Text as RawText } from "react-native";
import Text from "@/components/text";
import Button from "@/components/button";
import { ColorConst } from "@/constants/theme";
import IcClose from "@/components/icons/close";
import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { BlurView } from "expo-blur";
import Tabs from "./tabs";
import { IcReset } from "./icons/repeat";
import IcPause from "./icons/pause";
import CircularProgress from "./charts/circular-progress";
import { hexToRgba } from "@/utilities/cn";

type TimerState = "default" | "starting" | "running" | "paused" | "completed";
type TimerPhase = "effort" | "rest";

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
  const [state, setState] = useState<TimerState>(initialState);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(effortSeconds);
  const [round, setRound] = useState<number>(currentRound);
  const [phase, setPhase] = useState<TimerPhase>("effort");
  const mainIntervalRef = useRef<number>(null);
  const totalSeconds = phase === "effort" ? effortSeconds : restSeconds;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  const phaseTabs = [`Effort ${effortSeconds}s`, `Rest ${restSeconds}s`];
  const currentPhaseTab = phaseTabs[phase === "effort" ? 0 : 1];

  const COUNTDOWN_TO_START = 5;
  const [startingIn, setStartingIn] = useState(COUNTDOWN_TO_START);

  // countdown 5..1 to start
  const clearCountdown = () => {
    setStartingIn(COUNTDOWN_TO_START);
  };

  const startTimer = () => {
    setState("starting");
    const startingIntervalId = setInterval(() => {
      setStartingIn((prev) => prev - 1);
    }, 1000);

    const timerId = setTimeout(() => {
      clearInterval(startingIntervalId);
      setState("running");
      onStarted?.();
      clearCountdown();

      // Start the main timer interval
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }, COUNTDOWN_TO_START * 1000);

    return () => {
      clearInterval(startingIntervalId);
      clearTimeout(timerId);
      clearCountdown();
    };
  };

  const pauseTimer = () => {
    setState("paused");
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  };

  const resumeTimer = () => {
    setState("running");
    mainIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
  };

  const resetTimer = () => {
    setState("default");
    setPhase("effort");
    setRound(0);
    setRemainingSeconds(effortSeconds);
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  };

  // Cleanup interval when paused
  useEffect(() => {
    if (state === "paused" && mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  }, [state]);

  // Effect to handle phase/round transitions
  useEffect(() => {
    if (state === "running" && remainingSeconds <= 0) {
      if (phase === "effort") {
        // Switch to rest phase
        setPhase("rest");
        setRemainingSeconds(restSeconds);
      } else {
        // Rest phase done, move to next round
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
          // All rounds completed
          setState("completed");
          setRemainingSeconds(0);
          if (mainIntervalRef.current) {
            clearInterval(mainIntervalRef.current);
            mainIntervalRef.current = null;
          }
        } else {
          // Start next round
          setRound(nextRound);
          setPhase("effort");
          setRemainingSeconds(effortSeconds);
        }
      }
    }
  }, [
    state,
    remainingSeconds,
    phase,
    round,
    totalRounds,
    effortSeconds,
    restSeconds,
  ]);

  // Cleanup interval on unmount or state change
  useEffect(() => {
    return () => {
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
        mainIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <View
      className={clsx(
        "border-2 rounded-2xl p-4 relative overflow-hidden",
        {
          "bg-light border-stroke": [
            "completed",
            "default",
            "starting",
          ].includes(state),
          "bg-[#FFF7F6] border-error":
            ["paused", "running"].includes(state) && phase === "effort",
          "bg-success/5 border-success":
            ["paused", "running"].includes(state) && phase === "rest",
        },

        size === "large" ? "gap-4" : "gap-3",
        className,
      )}
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
            selectedClassName={clsx({
              "bg-error2": phase === "effort",
              "bg-green": phase === "rest",
            })}
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
            backgroundColor={
              phase === "effort"
                ? "#FFE8E5"
                : hexToRgba(ColorConst.success, 0.1)
            }
            progressColor={phase === 'effort' ? ColorConst.error2 : ColorConst.green}
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
