import { ColorConst } from "./theme";
import { hexToRgba } from "@/utilities/cn";

export const TabataTheme = {
  effort: {
    progressColor: ColorConst.error,
    backgroundColor: hexToRgba(ColorConst.error, 0.1),
    borderColor: ColorConst.error,
    cardBackgroundColor: "#FFF7F6",
    tabBackgroundColor: ColorConst.error2,
    textColor: ColorConst.error,
  },
  rest: {
    progressColor: ColorConst.green,
    backgroundColor: hexToRgba(ColorConst.success, 0.1),
    borderColor: ColorConst.success,
    cardBackgroundColor: "#F6FDF7",
    tabBackgroundColor: ColorConst.green,
    textColor: ColorConst.success,
  },
  default: {
    progressColor: ColorConst.primary,
    backgroundColor: ColorConst.light,
    borderColor: ColorConst.stroke,
    cardBackgroundColor: "#F6F7FC",
    tabBackgroundColor: undefined,
    textColor: ColorConst.accent,
  },
} as const;

export type TabataThemeType = typeof TabataTheme;
export type TabataPhase = "effort" | "rest";
export type TabataState = "default" | "starting" | "running" | "paused" | "completed";
