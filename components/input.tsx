import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { ComponentProps } from "react";
import { TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tv } from "tailwind-variants";
import Text from "./text";
import { useTranslation } from "react-i18next";

const input = tv({
  base: "bg-white border border-stroke p-4 rounded-lg text-text",
});

export default function Input({
  className = "",
  label,
  placeholder,
  ...props
}: TextInputProps &
  ComponentProps<typeof input> & {
    label?: string;
  }) {
  const {t } = useTranslation();
  return (
    <View className={cn("flex flex-col gap-2", className)}>
      {label && <Text className="text-accent font-medium text-sm">{label}</Text>}
      <TextInput
        className={cn(input())}
        placeholderTextColor={ColorConst.subtleText}
        placeholder={placeholder ? t(placeholder) : undefined}
        {...props}
      />
    </View>
  );
}
