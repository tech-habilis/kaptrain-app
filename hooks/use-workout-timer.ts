import { useState, useEffect, useRef, useCallback } from "react";

export type TimerState =
  | "default"
  | "starting"
  | "running"
  | "paused"
  | "completed";

export type TimerType = "stopwatch" | "countdown" | "emom" | "amrap" | "tabata" | "custom";
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
  start: () => void;

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
   * Start the timer without a countdown
   */
  startWithoutCountdown: () => void;

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
  const [state, setState] = useState<TimerState>(initialState);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    timerType === "countdown" || timerType === "amrap"
      ? durationSeconds || 60
      : timerType === "stopwatch"
        ? 0
        : effortSeconds,
  );
  const [round, setRound] = useState<number>(initialRound);
  const [phase, setPhase] = useState<TimerPhase>("effort");
  const [startingIn, setStartingIn] = useState(COUNTDOWN_TO_START);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);

  const mainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setStartingIn(COUNTDOWN_TO_START);
  }, []);

  const start = useCallback(() => {
    // For stopwatch and countdown, start immediately without countdown
    if (timerType === "stopwatch" || timerType === "countdown" || timerType === "amrap") {
      setState("running");
      onStarted?.();

      mainIntervalRef.current = setInterval(() => {
        if (timerType === "stopwatch") {
          setRemainingSeconds((prev) => prev + 1);
        } else {
          setRemainingSeconds((prev) => prev - 1);
        }
      }, 1000);
      return;
    }

    // For interval timers, use countdown
    setState("starting");

    startingIntervalRef.current = setInterval(() => {
      setStartingIn((prev) => prev - 1);
    }, 1000);

    startingTimeoutRef.current = setTimeout(() => {
      if (startingIntervalRef.current) {
        clearInterval(startingIntervalRef.current);
        startingIntervalRef.current = null;
      }
      setState("running");
      onStarted?.();
      clearCountdown();

      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }, COUNTDOWN_TO_START * 1000);
  }, [timerType, onStarted, clearCountdown]);

  const startWithoutCountdown = useCallback(() => {
    setState("running");
    onStarted?.();
    clearCountdown();

    if (timerType === "stopwatch") {
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }
  }, [timerType, onStarted, clearCountdown]);

  const pause = useCallback(() => {
    setState("paused");
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    setState("running");
    if (timerType === "stopwatch") {
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }
  }, [timerType]);

  const reset = useCallback(() => {
    setState("default");
    setRemainingSeconds(
      timerType === "countdown" || timerType === "amrap"
        ? durationSeconds || 60
        : timerType === "stopwatch"
          ? 0
          : effortSeconds,
    );
    setRound(initialRound);
    setPhase("effort");
    setRoundsCompleted(0);
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
  }, [timerType, durationSeconds, effortSeconds, initialRound, clearCountdown]);

  const incrementRound = useCallback(() => {
    setRoundsCompleted((prev) => prev + 1);
  }, []);

  const decrementRound = useCallback(() => {
    setRoundsCompleted((prev) => Math.max(0, prev - 1));
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
      setState("completed");
      setRemainingSeconds(0);
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
        mainIntervalRef.current = null;
      }
      onCompleted?.();
      return;
    }

    // Interval timers (tabata, custom, emom)
    if (
      (timerType === "tabata" || timerType === "custom" || timerType === "emom") &&
      remainingSeconds <= 0
    ) {
      if (phase === "effort") {
        if (timerType === "emom") {
          // EMOM: Switch to rest for remainder of minute
          setPhase("rest");
          setRemainingSeconds(60 - effortSeconds);
          onPhaseChange?.("rest");
        } else {
          // Tabata/Custom: Switch to rest
          setPhase("rest");
          setRemainingSeconds(restSeconds);
          onPhaseChange?.("rest");
        }
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
          onCompleted?.();
        } else {
          // Start next round
          setRound(nextRound);
          setPhase("effort");
          setRemainingSeconds(effortSeconds);
          onPhaseChange?.("effort");
          onRoundChange?.(nextRound);
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
    timerType,
    onPhaseChange,
    onRoundChange,
    onCompleted,
  ]);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
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
    };
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
    start,
    pause,
    resume,
    reset,
    totalSeconds,
    isPaused: state === "paused",
    phaseTabs,
    currentPhaseTab,
    startWithoutCountdown,
    roundsCompleted,
    incrementRound,
    decrementRound,
  };
}
