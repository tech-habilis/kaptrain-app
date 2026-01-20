import { create } from "zustand";
import type { DateType } from "react-native-ui-datepicker";
import type { TChoice } from "@/types";

export interface SessionBlockData {
  id: string;
  title: string;
  description: string;
  intensity: TChoice;
  exercises: TChoice[];
}

export interface CreateSessionData {
  // Step 1: Basic Info
  theme: TChoice | null;
  sports: TChoice[];
  date: DateType | null;
  timeRange: { start: string; end: string } | null;

  // Step 2: Details
  sessionName: string;
  blocks: SessionBlockData[];
}

interface CreateSessionState {
  // Session data
  sessionData: CreateSessionData | null;

  // Actions
  initializeSession: () => void;
  setStep1Data: (
    data: Omit<CreateSessionData, "sessionName" | "blocks">,
  ) => void;
  setSessionName: (name: string) => void;
  addBlock: (block: SessionBlockData) => void;
  updateBlock: (id: string, block: SessionBlockData) => void;
  setBlocks: (blocks: SessionBlockData[]) => void;
  reorderBlocks: (from: number, to: number) => void;
  removeBlock: (id: string) => void;
  reset: () => void;
}

const initialState: CreateSessionData = {
  theme: null,
  sports: [],
  date: null,
  timeRange: null,
  sessionName: "",
  blocks: [],
};

export const useCreateSessionStore = create<CreateSessionState>((set) => ({
  sessionData: null,

  initializeSession: () => {
    set({ sessionData: { ...initialState } });
  },

  setStep1Data: (data) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        ...data,
      },
    }));
  },

  setSessionName: (name) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        sessionName: name,
      },
    }));
  },

  addBlock: (block) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        blocks: [...state.sessionData!.blocks, block],
      },
    }));
  },

  updateBlock: (id, block) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        blocks: state.sessionData!.blocks.map((b) => (b.id === id ? block : b)),
      },
    }));
  },

  setBlocks: (blocks) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        blocks,
      },
    }));
  },

  reorderBlocks: (from, to) => {
    set((state) => {
      const blocks = [...state.sessionData!.blocks];
      const [movedBlock] = blocks.splice(from, 1);
      blocks.splice(to, 0, movedBlock);
      return {
        sessionData: {
          ...state.sessionData!,
          blocks,
        },
      };
    });
  },

  removeBlock: (id) => {
    set((state) => ({
      sessionData: {
        ...state.sessionData!,
        blocks: state.sessionData!.blocks.filter((b) => b.id !== id),
      },
    }));
  },

  reset: () => {
    set({ sessionData: null });
  },
}));
