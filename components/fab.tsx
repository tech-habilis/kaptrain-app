import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { ButtonIcon } from "./button";
import cn from "@/utilities/cn";

function Fab({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return (
    <View className={cn("absolute bottom-4 right-4", className)}>
      {children}
    </View>
  );
}

export default function SingleFab({
  icon,
  onPress,
  className = "",
}: {
  icon: ReactNode;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Fab className={className}>
      <ButtonIcon
        size="large"
        type="primary"
        className="w-14 h-14 rounded-2xl shadow-lg"
        onPress={onPress}
      >
        {icon}
      </ButtonIcon>
    </Fab>
  );
}
