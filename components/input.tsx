import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { ComponentProps, ReactNode } from "react";
import { TextInputProps, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tv } from "tailwind-variants";
import Text from "./text";
import { useTranslation } from "react-i18next";

const inputWrapper = tv({
  base: "bg-white border border-stroke px-4 rounded-lg text-text flex flex-row gap-4 justify-between items-center",
});

const input = tv({
  base: "flex-1 py-4",
});

export default function Input({
  className = "",
  label,
  placeholder,
  rightIcon,
  onRightIconPress,
  ...props
}: TextInputProps &
  ComponentProps<typeof inputWrapper> & {
    label?: string;
    rightIcon?: ReactNode;
    onRightIconPress?: () => void;
  }) {
  const { t } = useTranslation();
  return (
    <View className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}
      <View className={cn(inputWrapper())}>
        <TextInput
          className={cn(input())}
          placeholderTextColor={ColorConst.subtleText}
          placeholder={placeholder ? t(placeholder) : undefined}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
