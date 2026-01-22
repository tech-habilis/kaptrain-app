import {
  toast as rawToast,
  ToastOptions,
  ToastPosition,
} from "@backpackapp-io/react-native-toast";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import IcSuccess from "./icons/success";
import IcError from "./icons/error";
import IcInfo from "./icons/info";
import IcWarning from "./icons/warning";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import IcClose from "./icons/close";
import { Pressable } from "react-native";
import { ComponentProps } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
type ToastAction = {
  onPress: () => void;
  label: string;
};

const IconMap: Record<ToastType, React.FC<ComponentProps<typeof IcSuccess>>> = {
  success: IcSuccess,
  error: IcError,
  info: IcInfo,
  warning: IcWarning,
};

export const callToast = (
  message: string,
  {
    type,
    ...opts
  }: Omit<ToastOptions, "customToast"> & {
    type: ToastType;
    action?: ToastAction;
  },
) => {
  const Icon = IconMap[type];
  const containerClass: Record<ToastType, string> = {
    success: "border-green-500",
    error: "border-red-500",
    info: "border-blue-500",
    warning: "border-tertiary",
  };

  return rawToast(message, {
    position: ToastPosition.BOTTOM,
    disableShadow: true,
    customToast: (props) => (
      <ThemedView
        className={cn(
          "px-4 py-3 flex flex-row justify-between gap-2 border rounded-2xl",
          "items-center",
          containerClass[type],
        )}
        style={{ width: props.width, backgroundColor: ColorConst.light }}
      >
        <ThemedView>{opts.icon ?? <Icon size={24} />}</ThemedView>
        <ThemedText className={cn("text-primary flex-1")}>
          {props.message}
        </ThemedText>

        {opts.action && (
          <Pressable onPress={opts.action.onPress}>
            <ThemedText
              style={{
                color: ColorConst.secondary,
              }}
            >
              {opts.action.label}
            </ThemedText>
          </Pressable>
        )}

        <Pressable onPress={() => rawToast.dismiss(props.id)}>
          <IcClose />
        </Pressable>
      </ThemedView>
    ),
    ...opts,
  });
};

export const toast = {
  success: (
    message: string,
    opts?: Omit<ToastOptions, "customToast"> & { action?: ToastAction },
  ) => callToast(message, { type: "success", ...opts }),
  error: (
    message: string,
    opts?: Omit<ToastOptions, "customToast"> & { action?: ToastAction },
  ) => callToast(message, { type: "error", ...opts }),
  info: (
    message: string,
    opts?: Omit<ToastOptions, "customToast"> & { action?: ToastAction },
  ) => callToast(message, { type: "info", ...opts }),
  warning: (
    message: string,
    opts?: Omit<ToastOptions, "customToast"> & { action?: ToastAction },
  ) => callToast(message, { type: "warning", ...opts }),
};
