import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { ComponentProps, ReactNode } from "react";
import { TextInputProps, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tv } from "tailwind-variants";
import Text from "./text";
import { useTranslation } from "react-i18next";

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
  base: "flex-1 py-4",
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
  ...props
}: TextInputProps &
  ComponentProps<typeof inputWrapper> & {
    label?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onRightIconPress?: () => void;
    unit?: string;
    inputClassName?: string;
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
        <View className="bg-light py-5 px-[22.5px] justify-center items-center">
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
      <View className={cn(inputWrapper({ type }))}>
        {renderLeftSide()}
        <TextInput
          className={cn(input({ type }), inputClassName)}
          placeholderTextColor={ColorConst.subtleText}
          placeholder={placeholder ? t(placeholder) : undefined}
          keyboardType={keyboardType || type === "unit" ? "decimal-pad" : undefined}
          returnKeyType={returnKeyType || type === "unit" ? "done" : undefined}
          {...props}
        />
        {renderRightSide()}
      </View>
    </View>
  );
}
