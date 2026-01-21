import { create } from "zustand";
import type { TimerType } from "@/hooks/use-workout-timer";

export interface TimerConfig {
  timerType: TimerType;
  effortSeconds: number;
  restSeconds: number;
  durationSeconds: number;
  rounds: number;
}

interface TimerState {
  // Timer configuration
  timerConfig: TimerConfig | null;

  // Actions
  initializeTimer: (config: TimerConfig) => void;
  setTimerType: (timerType: TimerType) => void;
  setEffortSeconds: (seconds: number) => void;
  setRestSeconds: (seconds: number) => void;
  setDurationSeconds: (seconds: number) => void;
  setRounds: (rounds: number) => void;
  updateConfig: (config: Partial<TimerConfig>) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timerConfig: null,

  initializeTimer: (config) => {
    set({ timerConfig: config });
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
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, rounds }
        : null,
    }));
  },

  updateConfig: (config) => {
    set((state) => ({
      timerConfig: state.timerConfig
        ? { ...state.timerConfig, ...config }
        : null,
    }));
  },

  reset: () => {
    set({ timerConfig: null });
  },
}));
