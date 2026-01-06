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
