import { create } from "zustand";
import type { TimerType, TimerPhase } from "@/hooks/use-workout-timer";

export interface TimerConfig {
  id?: string;
  timerType: TimerType;
  effortSeconds: number;
  restSeconds: number;
  durationSeconds: number;
  rounds: number;
}

interface TimerState {
  // Timer configuration
  timerConfig: TimerConfig | null;

  // Widget visibility
  showWidget: boolean;

  // Timer runtime state
  runtimeState: "default" | "starting" | "running" | "paused" | "completed";
  remainingSeconds: number;
  round: number;
  phase: TimerPhase;
  startingIn: number;
  roundsCompleted: number;

  // Timer initialization flag (to prevent re-initialization)
  timerInitialized: boolean;

  // Flags to track if intervals are already active (prevents duplicate intervals)
  intervalActive: boolean;
  startingIntervalActive: boolean;
  startingTimeoutActive: boolean;

  // Actions
  initializeTimer: (config: TimerConfig) => void;
  setTimerType: (timerType: TimerType) => void;
  setEffortSeconds: (seconds: number) => void;
  setRestSeconds: (seconds: number) => void;
  setDurationSeconds: (seconds: number) => void;
  setRounds: (rounds: number) => void;
  updateConfig: (config: Partial<TimerConfig>) => void;
  setShowWidget: (show: boolean) => void;

  // Timer runtime actions
  setRuntimeState: (
    state: "default" | "starting" | "running" | "paused" | "completed",
  ) => void;
  setTimerRemainingSeconds: (seconds: number) => void;
  incrementTimerRemainingSeconds: () => void;
  decrementTimerRemainingSeconds: () => void;
  decrementTimerStartingIn: () => void;
  setTimerRound: (round: number) => void;
  setTimerPhase: (phase: TimerPhase) => void;
  setTimerStartingIn: (value: number) => void;
  setTimerRoundsCompleted: (count: number) => void;
  incrementTimerRoundsCompleted: () => void;
  decrementTimerRoundsCompleted: () => void;
  setTimerInitialized: (initialized: boolean) => void;
  setIntervalActive: (active: boolean) => void;
  setStartingIntervalActive: (active: boolean) => void;
  setStartingTimeoutActive: (active: boolean) => void;

  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timerConfig: null,
  showWidget: false,

  // Timer runtime state initial values
  runtimeState: "default",
  remainingSeconds: 0,
  round: 0,
  phase: "effort",
  startingIn: 5,
  roundsCompleted: 0,

  // Timer initialization flag
  timerInitialized: false,

  // Interval activity flags
  intervalActive: false,
  startingIntervalActive: false,
  startingTimeoutActive: false,

  initializeTimer: (config) => {
    const configWithId = { ...config, id: Date.now().toString() };
    set({
      timerConfig: configWithId,
      showWidget: true,
      runtimeState: "default",
      remainingSeconds: 0,
      round: 0,
      phase: "effort",
      startingIn: 5,
      roundsCompleted: 0,
      timerInitialized: false, // Reset initialization flag when creating new timer
      intervalActive: false,
      startingIntervalActive: false,
      startingTimeoutActive: false,
    });
  },

  setTimerType: (timerType) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, timerType }
        : null,
    }));
  },

  setEffortSeconds: (effortSeconds) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, effortSeconds }
        : null,
    }));
  },

  setRestSeconds: (restSeconds) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, restSeconds }
        : null,
    }));
  },

  setDurationSeconds: (durationSeconds) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, durationSeconds }
        : null,
    }));
  },

  setRounds: (rounds) => {
    set((state) => ({
      timerConfig: state.timerConfig ? { ...state.timerConfig, rounds } : null,
    }));
  },

  updateConfig: (config) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, ...config }
        : null,
    }));
  },

  setShowWidget: (show) => {
    set({ showWidget: show });
  },

  // Timer runtime actions
  setRuntimeState: (runtimeState) => set({ runtimeState }),
  setTimerRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),
  incrementTimerRemainingSeconds: () =>
    set((state) => ({ remainingSeconds: state.remainingSeconds + 1 })),
  decrementTimerRemainingSeconds: () =>
    set((state) => ({ remainingSeconds: state.remainingSeconds - 1 })),
  decrementTimerStartingIn: () =>
    set((state) => ({ startingIn: state.startingIn - 1 })),
  setTimerRound: (round) => set({ round }),
  setTimerPhase: (phase) => set({ phase }),
  setTimerStartingIn: (startingIn) => set({ startingIn }),
  setTimerRoundsCompleted: (roundsCompleted) => set({ roundsCompleted }),
  incrementTimerRoundsCompleted: () =>
    set((state) => ({ roundsCompleted: state.roundsCompleted + 1 })),
  decrementTimerRoundsCompleted: () =>
    set((state) => ({
      roundsCompleted: Math.max(0, state.roundsCompleted - 1),
    })),
  setTimerInitialized: (timerInitialized) => set({ timerInitialized }),
  setIntervalActive: (intervalActive) => set({ intervalActive }),
  setStartingIntervalActive: (startingIntervalActive) =>
    set({ startingIntervalActive }),
  setStartingTimeoutActive: (startingTimeoutActive) =>
    set({ startingTimeoutActive }),

  reset: () => {
    set({
      timerConfig: null,
      showWidget: true,
      runtimeState: "default",
      remainingSeconds: 0,
      round: 0,
      phase: "effort",
      startingIn: 5,
      roundsCompleted: 0,
      timerInitialized: false,
      intervalActive: false,
      startingIntervalActive: false,
      startingTimeoutActive: false,
    });
  },
}));
