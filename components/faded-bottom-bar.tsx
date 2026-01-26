import { View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { PropsWithChildren } from "react";
import cn from "@/utilities/cn";

export default function FadedBottomBar({
  children,
  className = "",
}: PropsWithChildren & ViewProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 pb-safe px-4 pt-4">
      <BlurView
        intensity={2}
        className="absolute inset-0 bg-linear-to-t from-white from-66% to-transparent"
      />
      <View
        className={cn(
          "flex-row android:mb-6 gap-6 items-center justify-between",
          className,
        )}
      >
        {children}
      </View>
    </View>
  );
}
