import { Pressable, View } from "react-native";
import Text from "./text";
import { tv, VariantProps } from "tailwind-variants";
import cn from "@/utilities/cn";

export interface TChoice {
  text: string;
  secondaryText?: string;
}

const choiceWrapper = tv({
  base: "rounded-lg",
  variants: {
    type: {
      default: "px-2 py-4 justify-center items-center",
    },
    selected: {
      true: "border-2 border-primary bg-light",
      false: "border border-stroke",
    },
  },
  defaultVariants: {
    type: "default",
    selected: false,
  },
});

const choiceText = tv({
  base: "text-sm font-medium",
  variants: {
    type: {
      default: "",
    },
    selected: {
      true: "text-text",
      false: "text-subtleText",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

type ChoiceVariants = VariantProps<typeof choiceWrapper>;

export const Choices = ({
  label,
  data,
  selectedChoice,
  onChange,
  type = "default",
}: {
  data: TChoice[];
  selectedChoice?: TChoice;
  label?: string;
  onChange: (choice: TChoice) => void;
} & ChoiceVariants) => {
  return (
    <View className="gap-2">
      {label !== undefined && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}
      <View className="gap-2 mt-2">
        {data.map((choice) => {
          const selected = choice === selectedChoice;
          return (
            <Pressable
              key={choice.text}
              className={choiceWrapper({ selected, type })}
              onPress={() => onChange(choice)}
            >
              <Text className={cn(choiceText({ type, selected }))}>{choice.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
