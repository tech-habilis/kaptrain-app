import {
  toast as rawToast,
  ToastOptions,
  ToastPosition,
} from "@backpackapp-io/react-native-toast";
import IcSuccess from "./icons/success";
import IcError from "./icons/error";
import IcInfo from "./icons/info";
import IcWarning from "./icons/warning";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import IcClose from "./icons/close";
import { Pressable, View } from "react-native";
import { ComponentProps } from "react";
import Text from "./text";

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

  const textClass: Record<ToastType, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-tertiary'
  }

  return rawToast(message, {
    position: ToastPosition.BOTTOM,
    disableShadow: true,
    customToast: (props) => (
      <View
        className={cn(
          "px-4 py-3 flex flex-row justify-between gap-2 border rounded-2xl",
          "items-center",
          containerClass[type],
        )}
        style={{ width: props.width, backgroundColor: ColorConst.light }}
      >
        <View>{opts.icon ?? <Icon size={24} />}</View>
        <Text className={cn("flex-1", textClass[type])}>{props.message}</Text>

        {opts.action && (
          <Pressable onPress={opts.action.onPress}>
            <Text
              style={{
                color: ColorConst.secondary,
              }}
            >
              {opts.action.label}
            </Text>
          </Pressable>
        )}

        <Pressable onPress={() => rawToast.dismiss(props.id)}>
          <IcClose />
        </Pressable>
      </View>
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
