import { ReactNode } from "react";

export type TSession = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
    // ... add other user data here
  };
};

export interface StatisticWidget {
  title: string;
  subtitle: string;
  chart: ReactNode;
  chartDetail?: ReactNode;
  route: string;
}

export type ExerciseItem = {
  id: string;
  title: string;
  image: any;
  icon?: ReactNode;
  isFavorite: boolean;
};

export type ProgramItem = {
  id: string;
  title: string;
  price: string;
  isBought: boolean;
  createdBy: string;
  image: any;
  chips: {
    icon: ReactNode;
    text: string;
  }[];
};

export type ProgramSectionProps = {
  title: string;
  description?: string;
  programs: ProgramItem[];
};

export interface TChoice {
  text: string;
  secondaryText?: string;
  leftIcon?: React.ReactNode;
}

export interface Exercise {
  id: string;
  title: string;
  image: string;
}

export interface ISessionNote {
  title: string;
  date: string;
  text: string;
}

export interface SessionNoteCardProps {
  sessionTitle: string;
  date: string;
  notes: ISessionNote[];
}
