import { ColorConst } from "./theme";
import { hexToRgba } from "@/utilities/cn";

export const TabataTheme = {
  effort: {
    progressColor: ColorConst.error2,
    backgroundColor: "#FFE8E5",
    borderColor: ColorConst.error,
    cardBackgroundColor: "#FFF7F6",
    tabBackgroundColor: ColorConst.error2,
    badgeBackgroundColor: ColorConst.error,
    textColor: ColorConst.error,
  },
  rest: {
    progressColor: ColorConst.green,
    backgroundColor: hexToRgba(ColorConst.success, 0.1),
    borderColor: ColorConst.success,
    cardBackgroundColor: hexToRgba(ColorConst.success, 0.05),
    tabBackgroundColor: ColorConst.green,
    badgeBackgroundColor: ColorConst.success,
    textColor: ColorConst.success,
  },
  default: {
    backgroundColor: ColorConst.light,
    borderColor: ColorConst.stroke,
    textColor: ColorConst.accent,
  },
  completed: {
    backgroundColor: ColorConst.light,
    borderColor: ColorConst.primary,
    buttonBackgroundColor: ColorConst.success,
  },
} as const;

export type TabataPhase = "effort" | "rest";
export type TabataState = "default" | "starting" | "running" | "paused" | "completed";