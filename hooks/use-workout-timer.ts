import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/stores/timer-store";

export type TimerState =
  | "default"
  | "starting"
  | "running"
  | "paused"
  | "completed";

export type TimerType =
  | "stopwatch"
  | "countdown"
  | "emom"
  | "amrap"
  | "tabata"
  | "custom";
export type TimerPhase = "effort" | "rest";

export interface UseWorkoutTimerOptions {
  /**
   * Type of timer
   */
  timerType: TimerType;

  /**
   * Total duration in seconds (for countdown, amrap)
   */
  durationSeconds?: number;

  /**
   * Effort duration in seconds (for tabata, custom, emom)
   */
  effortSeconds?: number;

  /**
   * Rest duration in seconds (for tabata, custom)
   */
  restSeconds?: number;

  /**
   * Total number of rounds (for tabata, custom, emom)
   */
  totalRounds?: number;

  /**
   * Initial round (0-based)
   */
  initialRound?: number;

  /**
   * Initial state of the timer
   */
  initialState?: TimerState;

  /**
   * Callback when timer starts running (after countdown)
   */
  onStarted?: () => void;

  /**
   * Callback when timer completes all rounds
   */
  onCompleted?: () => void;

  /**
   * Callback when phase changes (for interval timers)
   */
  onPhaseChange?: (phase: TimerPhase) => void;

  /**
   * Callback when round changes
   */
  onRoundChange?: (round: number) => void;
}

export interface UseWorkoutTimerReturn {
  /**
   * Current state of the timer
   */
  state: TimerState;

  /**
   * Remaining seconds in current phase
   */
  remainingSeconds: number;

  /**
   * Current round (0-based)
   */
  round: number;

  /**
   * Current phase (effort or rest) - for interval timers
   */
  phase: TimerPhase;

  /**
   * Starting countdown value (5 to 1)
   */
  startingIn: number;

  /**
   * Formatted minutes (zero-padded)
   */
  formattedMinutes: string;

  /**
   * Formatted seconds (zero-padded)
   */
  formattedSeconds: string;

  /**
   * Minutes part of remaining time
   */
  minutes: number;

  /**
   * Seconds part of remaining time
   */
  seconds: number;

  /**
   * Start the timer (with countdown for interval timers)
   */
  startWithCountdown: () => void;

  /**
   * Pause the timer
   */
  pause: () => void;

  /**
   * Resume the timer
   */
  resume: () => void;

  /**
   * Reset the timer to initial state
   */
  reset: () => void;

  /**
   * Total seconds in current phase
   */
  totalSeconds: number;

  /**
   * Whether the timer is paused
   */
  isPaused: boolean;

  /**
   * Array of phase tabs (for interval timers)
   */
  phaseTabs: string[] | null;

  /**
   * Current phase tab (for interval timers)
   */
  currentPhaseTab: string | null;

  /**
   * Start the timer immediately (no countdown, skips "starting" state)
   */
  startImmediately: () => void;

  /**
   * Rounds completed (for AMRAP)
   */
  roundsCompleted: number;

  /**
   * Increment rounds completed (for AMRAP)
   */
  incrementRound: () => void;

  /**
   * Decrement rounds completed (for AMRAP)
   */
  decrementRound: () => void;
}

const COUNTDOWN_TO_START = 5;

export function useWorkoutTimer({
  timerType,
  durationSeconds,
  effortSeconds = 20,
  restSeconds = 10,
  totalRounds = 8,
  initialRound = 0,
  initialState = "default",
  onStarted,
  onCompleted,
  onPhaseChange,
  onRoundChange,
}: UseWorkoutTimerOptions): UseWorkoutTimerReturn {
  const timerStore = useTimerStore();

  // Local refs for intervals (not shared in store)
  const mainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const startingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get state from store
  const state = timerStore.runtimeState;
  const remainingSeconds = timerStore.remainingSeconds;
  const round = timerStore.round;
  const phase = timerStore.phase;
  const startingIn = timerStore.startingIn;
  const roundsCompleted = timerStore.roundsCompleted;
  const timerInitialized = timerStore.timerInitialized;
  const intervalActive = timerStore.intervalActive;
  const startingIntervalActive = timerStore.startingIntervalActive;

  // Initialize state on first render if not already set
  useEffect(() => {
    if (!timerInitialized) {
      if (timerType === "countdown" || timerType === "amrap") {
        timerStore.setTimerRemainingSeconds(durationSeconds || 60);
      } else if (timerType === "stopwatch") {
        timerStore.setTimerRemainingSeconds(0);
      } else {
        timerStore.setTimerRemainingSeconds(effortSeconds);
      }
      timerStore.setTimerRound(initialRound);
      timerStore.setRuntimeState(initialState);
      timerStore.setTimerInitialized(true);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timerInitialized]);

  // Sync remainingSeconds with props when timer is in default state
  useEffect(() => {
    if (state === "default" && timerInitialized) {
      if (timerType === "countdown" || timerType === "amrap") {
        timerStore.setTimerRemainingSeconds(durationSeconds || 60);
      } else if (timerType === "stopwatch") {
        timerStore.setTimerRemainingSeconds(0);
      } else {
        timerStore.setTimerRemainingSeconds(effortSeconds);
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [durationSeconds, effortSeconds, timerType, state, timerInitialized]);

  // Resume timer if state is running but no interval is active
  useEffect(() => {
    if (state === "running" && !intervalActive && !mainIntervalRef.current) {
      timerStore.setIntervalActive(true);
      mainIntervalRef.current = setInterval(() => {
        if (timerType === "stopwatch") {
          timerStore.incrementTimerRemainingSeconds();
        } else {
          timerStore.decrementTimerRemainingSeconds();
        }
      }, 1000);
    }

    // Resume countdown if state is starting but no interval is active
    if (
      state === "starting" &&
      !startingIntervalActive &&
      !startingIntervalRef.current
    ) {
      timerStore.setStartingIntervalActive(true);
      startingIntervalRef.current = setInterval(() => {
        timerStore.decrementTimerStartingIn();
      }, 1000);

      // Calculate remaining countdown time
      const remainingCountdown = startingIn * 1000;

      startingTimeoutRef.current = setTimeout(() => {
        if (startingIntervalRef.current) {
          clearInterval(startingIntervalRef.current);
          startingIntervalRef.current = null;
        }
        timerStore.setRuntimeState("running");
        onStarted?.();
        timerStore.setTimerStartingIn(COUNTDOWN_TO_START);
        timerStore.setStartingIntervalActive(false);

        timerStore.setIntervalActive(true);
        mainIntervalRef.current = setInterval(() => {
          timerStore.decrementTimerRemainingSeconds();
        }, 1000);
      }, remainingCountdown);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    state,
    timerType,
    startingIn,
    onStarted,
    intervalActive,
    startingIntervalActive,
  ]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  // Calculate total seconds based on timer type
  const totalSeconds =
    state === "completed"
      ? 0
      : timerType === "stopwatch"
        ? remainingSeconds
        : timerType === "countdown" || timerType === "amrap"
          ? durationSeconds || 60
          : phase === "effort"
            ? effortSeconds
            : restSeconds;

  // Phase tabs for interval timers
  const phaseTabs =
    timerType === "tabata" || timerType === "custom"
      ? [`Effort ${effortSeconds}s`, `Rest ${restSeconds}s`]
      : timerType === "emom"
        ? [`Work ${effortSeconds}s`, `Rest`]
        : null;

  const currentPhaseTab =
    phaseTabs && timerType !== "emom"
      ? phaseTabs[phase === "effort" ? 0 : 1]
      : phaseTabs?.[0] || null;

  const clearCountdown = useCallback(() => {
    timerStore.setTimerStartingIn(COUNTDOWN_TO_START);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const startWithCountdown = useCallback(() => {
    // For stopwatch and countdown, start immediately without countdown
    if (
      timerType === "stopwatch" ||
      timerType === "countdown" ||
      timerType === "amrap"
    ) {
      timerStore.setRuntimeState("running");
      timerStore.setIntervalActive(true);
      onStarted?.();

      mainIntervalRef.current = setInterval(() => {
        if (timerType === "stopwatch") {
          timerStore.incrementTimerRemainingSeconds();
        } else {
          timerStore.decrementTimerRemainingSeconds();
        }
      }, 1000);
      return;
    }

    // For interval timers, use countdown
    timerStore.setRuntimeState("starting");
    timerStore.setStartingIntervalActive(true);

    startingIntervalRef.current = setInterval(() => {
      timerStore.decrementTimerStartingIn();
    }, 1000);

    startingTimeoutRef.current = setTimeout(() => {
      if (startingIntervalRef.current) {
        clearInterval(startingIntervalRef.current);
        startingIntervalRef.current = null;
      }
      timerStore.setRuntimeState("running");
      timerStore.setStartingIntervalActive(false);
      timerStore.setIntervalActive(true);
      onStarted?.();
      clearCountdown();

      mainIntervalRef.current = setInterval(() => {
        timerStore.decrementTimerRemainingSeconds();
      }, 1000);
    }, COUNTDOWN_TO_START * 1000);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timerType, onStarted, clearCountdown]);

  const startImmediately = useCallback(() => {
    timerStore.setRuntimeState("running");
    timerStore.setIntervalActive(true);
    onStarted?.();
    clearCountdown();

    if (timerType === "stopwatch") {
      mainIntervalRef.current = setInterval(() => {
        timerStore.incrementTimerRemainingSeconds();
      }, 1000);
    } else {
      mainIntervalRef.current = setInterval(() => {
        timerStore.decrementTimerRemainingSeconds();
      }, 1000);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timerType, onStarted, clearCountdown]);

  const pause = useCallback(() => {
    timerStore.setRuntimeState("paused");
    timerStore.setIntervalActive(false);
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const resume = useCallback(() => {
    timerStore.setRuntimeState("running");
    timerStore.setIntervalActive(true);
    if (timerType === "stopwatch") {
      mainIntervalRef.current = setInterval(() => {
        timerStore.incrementTimerRemainingSeconds();
      }, 1000);
    } else {
      mainIntervalRef.current = setInterval(() => {
        timerStore.decrementTimerRemainingSeconds();
      }, 1000);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timerType]);

  const reset = useCallback(() => {
    timerStore.setRuntimeState("default");
    timerStore.setIntervalActive(false);
    timerStore.setStartingIntervalActive(false);
    timerStore.setStartingTimeoutActive(false);
    if (timerType === "countdown" || timerType === "amrap") {
      timerStore.setTimerRemainingSeconds(durationSeconds || 60);
    } else if (timerType === "stopwatch") {
      timerStore.setTimerRemainingSeconds(0);
    } else {
      timerStore.setTimerRemainingSeconds(effortSeconds);
    }
    timerStore.setTimerRound(initialRound);
    timerStore.setTimerPhase("effort");
    timerStore.setTimerRoundsCompleted(0);
    clearCountdown();

    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
    if (startingIntervalRef.current) {
      clearInterval(startingIntervalRef.current);
      startingIntervalRef.current = null;
    }
    if (startingTimeoutRef.current) {
      clearTimeout(startingTimeoutRef.current);
      startingTimeoutRef.current = null;
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [timerType, durationSeconds, effortSeconds, initialRound, clearCountdown]);

  const incrementRound = useCallback(() => {
    timerStore.incrementTimerRoundsCompleted();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const decrementRound = useCallback(() => {
    timerStore.decrementTimerRoundsCompleted();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  // Cleanup interval when paused
  useEffect(() => {
    if (state === "paused" && mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  }, [state]);

  // Effect to handle timer transitions
  useEffect(() => {
    if (state !== "running") return;

    // Countdown and AMRAP completion
    if (
      (timerType === "countdown" || timerType === "amrap") &&
      remainingSeconds <= 0
    ) {
      timerStore.setRuntimeState("completed");
      timerStore.setTimerRemainingSeconds(0);
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
        mainIntervalRef.current = null;
      }
      onCompleted?.();
      return;
    }

    // Interval timers (tabata, custom, emom)
    if (
      (timerType === "tabata" ||
        timerType === "custom" ||
        timerType === "emom") &&
      remainingSeconds <= 0
    ) {
      if (phase === "effort") {
        if (timerType === "emom") {
          // EMOM: Switch to rest for remainder of minute
          timerStore.setTimerPhase("rest");
          timerStore.setTimerRemainingSeconds(60 - effortSeconds);
          onPhaseChange?.("rest");
        } else {
          // Tabata/Custom: Switch to rest
          timerStore.setTimerPhase("rest");
          timerStore.setTimerRemainingSeconds(restSeconds);
          onPhaseChange?.("rest");
        }
      } else {
        // Rest phase done, move to next round
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
          // All rounds completed
          timerStore.setRuntimeState("completed");
          timerStore.setTimerRemainingSeconds(0);
          if (mainIntervalRef.current) {
            clearInterval(mainIntervalRef.current);
            mainIntervalRef.current = null;
          }
          onCompleted?.();
        } else {
          // Start next round
          timerStore.setTimerRound(nextRound);
          timerStore.setTimerPhase("effort");
          timerStore.setTimerRemainingSeconds(effortSeconds);
          onPhaseChange?.("effort");
          onRoundChange?.(nextRound);
        }
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    state,
    remainingSeconds,
    phase,
    round,
    totalRounds,
    effortSeconds,
    restSeconds,
    timerType,
    onPhaseChange,
    onRoundChange,
    onCompleted,
  ]);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      // Only clear global flags if this component had the active interval
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
        mainIntervalRef.current = null;
        timerStore.setIntervalActive(false);
      }
      if (startingIntervalRef.current) {
        clearInterval(startingIntervalRef.current);
        startingIntervalRef.current = null;
        timerStore.setStartingIntervalActive(false);
      }
      if (startingTimeoutRef.current) {
        clearTimeout(startingTimeoutRef.current);
        startingTimeoutRef.current = null;
        timerStore.setStartingTimeoutActive(false);
      }
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return {
    state,
    remainingSeconds,
    round,
    phase,
    startingIn,
    formattedMinutes,
    formattedSeconds,
    minutes,
    seconds,
    startWithCountdown,
    pause,
    resume,
    reset,
    totalSeconds,
    isPaused: state === "paused",
    phaseTabs,
    currentPhaseTab,
    startImmediately,
    roundsCompleted,
    incrementRound,
    decrementRound,
  };
}
