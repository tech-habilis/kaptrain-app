import { ReactNode } from "react";

export interface StatisticWidget {
  title: string;
  subtitle: string;
  chart: ReactNode;
  chartDetail?: ReactNode;
  route: string;
}
