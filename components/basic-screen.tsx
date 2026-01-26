import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import cn from "@/utilities/cn";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";

export default function BasicScreen({
  children,
  title,
  description,
  headerClassName = "",
  rightIcon,
  onRightIconPress,
}: PropsWithChildren & {
  title: string;
  description?: string;
  headerClassName?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}) {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      {/* Header */}
      <View className={cn("bg-[#F6F7FC] pt-safe pb-4 px-4", headerClassName)}>
        <View className="flex-row gap-1 items-center ">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft />
          </Pressable>
          <Text className="text-lg font-ls-bold text-secondary flex-1">
            {title}
          </Text>
          {rightIcon && (
            <Pressable onPress={onRightIconPress} className="p-2">
              {rightIcon}
            </Pressable>
          )}
        </View>

        {description && (
          <Text className="text-accent text-base">{description}</Text>
        )}
      </View>

      {/* Content */}
      {children}
    </View>
  );
}
