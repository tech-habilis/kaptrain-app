import cn from "@/utilities/cn";
import { View } from "react-native";
import Text from "./text";

export default function CircleBadge({
  children,
  text,
  className = "",
  textClassName = "",
}: {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  textClassName?: string;
}) {
  if (children && text) {
    throw new Error("CircleBadge cannot have both children and text prop");
  }

  return (
    <View
      className={cn(
        "rounded-full bg-primary size-6 items-center justify-center",
        className,
      )}
    >
      {text ? (
        <Text className={cn("text-white text-sm font-bold", textClassName)}>
          {text}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
