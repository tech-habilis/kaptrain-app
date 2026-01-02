import { Pressable, View } from "react-native";
import { tv, VariantProps } from "tailwind-variants";
import Text from "./text";
import IcClose from "./icons/close";
import { ReactNode } from "react";
import cn from "@/utilities/cn";

const chip = tv({
  base: "bg-white border border-stroke gap-1.5 p-2 rounded-sm flex-row items-center",
  variants: {
    size: {
      small: "",
    },
    type: {
      default: "",
      selected: "bg-secondary",
      disabled: "",
      uncheck: "",
    },
  },
  defaultVariants: {
    size: "small",
    type: "default",
  },
});

const chipText = tv({
  base: "text-black font-medium",
  variants: {
    type: {
      default: "",
      selected: "text-white",
      disabled: "",
      uncheck: "text-subtleText",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

type ChipVariants = VariantProps<typeof chip>;

export const Chip = ({
  text,
  size,
  type,
  leftIcon,
  onLeftSidePress,
  className = ''
}: ChipVariants & {
  text: string;
  leftIcon?: ReactNode;
  onLeftSidePress?: (isClose: boolean) => void;
  className?: string;
}) => {
  const renderLeftSide = () => {
    if (type === "selected") {
      return (
        <Pressable onPress={() => onLeftSidePress?.(true)}>
          <IcClose size={16} color="white" />
        </Pressable>
      );
    }

    if (leftIcon) {
      return leftIcon;
    }

    return null;
  };

  return (
    <View className={cn(chip({ size, type }), className)}>
      {renderLeftSide()}
      <Text className={chipText({ type })}>{text}</Text>
    </View>
  );
};
