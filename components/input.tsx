import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { ComponentProps, ReactNode, useState } from "react";
import {
  Platform,
  Pressable,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tv } from "tailwind-variants";
import Text from "./text";
import { useTranslation } from "react-i18next";
import IcEye from "./icons/eye";
import IcEyeOff from "./icons/eye-off";
import { clsx } from "clsx";

const inputWrapper = tv({
  base: "bg-white border border-stroke rounded-lg text-text flex flex-row gap-4 justify-between items-center",
  variants: {
    type: {
      default: "px-4",
      unit: "pl-3",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

const input = tv({
  base: "flex-1 py-4 h-14", // need to set height explicitly to make sure the placeholder does not go down on ios and input collapse on android
  variants: {
    type: {
      default: "",
      unit: "text-2xl font-bold",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export default function Input({
  className = "",
  label,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  type,
  unit,
  keyboardType,
  returnKeyType,
  inputClassName = "",
  error,
  style,
  asPressable = false,
  onPress,
  hintText,
  ...props
}: TextInputProps &
  ComponentProps<typeof inputWrapper> & {
    label?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onRightIconPress?: () => void;
    unit?: string;
    inputClassName?: string;
    error?: string;
    asPressable?: boolean;
    hintText?: string;
  }) {
  const { t } = useTranslation();

  const renderLeftSide = () => {
    if (leftIcon) {
      return <View className="">{leftIcon}</View>;
    }

    return null;
  };

  const renderRightSide = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightIconPress}>
          {rightIcon}
        </TouchableOpacity>
      );
    }

    if (type === "unit" && unit !== undefined) {
      return (
        <View className="bg-light h-14 px-[22.5px] justify-center items-center">
          <Text className="text-accent text-base">{unit}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}
      <Pressable onPress={asPressable ? onPress : undefined}>
        <View
          pointerEvents={asPressable ? "none" : undefined}
          className={clsx(inputWrapper({ type }), {
            "border-error2": !!error,
          })}
        >
          {renderLeftSide()}
          <TextInput
            className={cn(input({ type }), inputClassName)}
            placeholderTextColor={ColorConst.subtleText}
            placeholder={placeholder ? t(placeholder) : undefined}
            keyboardType={
              keyboardType !== undefined
                ? keyboardType
                : type === "unit"
                  ? "decimal-pad"
                  : undefined
            }
            returnKeyType={
              returnKeyType || type === "unit" ? "done" : undefined
            }
            onPress={asPressable ? undefined : onPress}
            style={[style, { lineHeight: Platform.select({ ios: 0 }) }]}
            {...props}
          />
          {renderRightSide()}
        </View>
      </Pressable>

      {/* hint & error text */}
      <Text
        className={clsx("text-subtleText text-xs", {
          "text-error2": !!error,
          "hidden": !error && !hintText
        })}
      >
        {error !== undefined ? error : hintText !== undefined ? hintText : ""}
      </Text>
    </View>
  );
}

export function PasswordInput(props: ComponentProps<typeof Input>) {
  const [showPasswordVisibility, setShowPasswordVisibility] = useState(false);

  return (
    <Input
      secureTextEntry={!showPasswordVisibility}
      rightIcon={showPasswordVisibility ? <IcEye /> : <IcEyeOff />}
      onRightIconPress={() =>
        setShowPasswordVisibility(!showPasswordVisibility)
      }
      {...props}
    />
  );
}
