import { Pressable, View } from "react-native";
import { tv, VariantProps } from "tailwind-variants";
import Text from "./text";
import IcClose from "./icons/close";

const chip = tv({
  base: "bg-white border border-stroke gap-1.5 p-2 rounded-sm",
  variants: {
    size: {
      small: "",
    },
    type: {
      default: "",
      selected: "bg-secondary flex-row items-center",
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
      uncheck: "",
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
  onLeftSidePress,
}: ChipVariants & {
  text: string;
  onLeftSidePress?: (isClose: boolean) => void;
}) => {
  const renderLeftSide = () => {
    if (type === "selected") {
      return (
        <Pressable onPress={() => onLeftSidePress?.(true)}>
          <IcClose size={16} color="white" />
        </Pressable>
      );
    }

    return null;
  };

  return (
    <View className={chip({ size, type })}>
      {renderLeftSide()}
      <Text className={chipText({ type })}>{text}</Text>
    </View>
  );
};
