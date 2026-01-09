import { useState, useEffect, useRef } from "react";

export type TimerState =
  | "default"
  | "starting"
  | "running"
  | "paused"
  | "completed";
export type TimerPhase = "effort" | "rest";

export interface UseTabataTimerOptions {
  /**
   * Effort duration in seconds
   */
  effortSeconds: number;

  /**
   * Rest duration in seconds
   */
  restSeconds: number;

  /**
   * Total number of rounds
   */
  totalRounds: number;

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
   * Callback when phase changes
   */
  onPhaseChange?: (phase: TimerPhase) => void;

  /**
   * Callback when round changes
   */
  onRoundChange?: (round: number) => void;
}

export interface UseTabataTimerReturn {
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
   * Current phase (effort or rest)
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
   * Start the timer (with countdown)
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
   * Array of phase tabs
   */
  phaseTabs: string[];

  /**
   * Current phase tab
   */
  currentPhaseTab: string;

  /**
   * Start the timer without a countdown
   */
  startWithoutCountdown: () => void;
}

const COUNTDOWN_TO_START = 5;

export function useTabataTimer({
  effortSeconds,
  restSeconds,
  totalRounds,
  initialRound = 0,
  initialState = "default",
  onStarted,
  onCompleted,
  onPhaseChange,
  onRoundChange,
}: UseTabataTimerOptions): UseTabataTimerReturn {
  const [state, setState] = useState<TimerState>(initialState);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(effortSeconds);
  const [round, setRound] = useState<number>(initialRound);
  const [phase, setPhase] = useState<TimerPhase>("effort");
  const [startingIn, setStartingIn] = useState(COUNTDOWN_TO_START);

  const mainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const startingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  const totalSeconds =
    state === "completed"
      ? 0
      : phase === "effort"
        ? effortSeconds
        : restSeconds;
  const phaseTabs = [`Effort ${effortSeconds}s`, `Rest ${restSeconds}s`];
  const currentPhaseTab = phaseTabs[phase === "effort" ? 0 : 1];

  const clearCountdown = () => {
    setStartingIn(COUNTDOWN_TO_START);
  };

  const start = () => {
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

      // Start the main timer interval
      mainIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }, COUNTDOWN_TO_START * 1000);
  };

  const startWithoutCountdown = () => {
    setState("running");
    onStarted?.();
    clearCountdown();

    // Start the main timer interval
    mainIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
  };

  const pause = () => {
    setState("paused");
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
      mainIntervalRef.current = null;
    }
  };

  const resume = () => {
    setState("running");
    mainIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
  };

  const reset = () => {
    setState("default");
    setRemainingSeconds(effortSeconds);
    setRound(initialRound);
    setPhase("effort");
    clearCountdown();

    // Clear all intervals
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
        onPhaseChange?.("rest");
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
  };
}
