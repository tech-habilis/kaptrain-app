import { Pressable, View } from "react-native";
import Text from "./text";
import { tv, VariantProps } from "tailwind-variants";
import cn from "@/utilities/cn";
import IcCheckboxSelected from "./icons/checkbox-selected";
import IcCheckbox from "./icons/checkbox";

export interface TChoice {
  text: string;
  secondaryText?: string;
  leftIcon?: React.ReactNode;
}

const choiceWrapper = tv({
  base: "rounded-lg px-2 py-4 justify-center items-center",
  variants: {
    type: {
      default: "",
      secondary: "flex-row items-center px-4",
      multipleChoice: "flex-row items-center px-3",
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
      secondary: "text-base font-bold",
      multipleChoice: "",
    },
    selected: {
      true: "text-text",
      false: "text-subtleText",
    },
  },
  compoundVariants: [
    {
      type: "secondary",
      className: "text-secondary",
    },
    {
      type: "multipleChoice",
      className: "text-text",
    },
  ],
  defaultVariants: {
    type: "default",
    selected: false,
  },
});

type ChoiceVariants = VariantProps<typeof choiceWrapper>;

export const Choices = ({
  label,
  data,
  selectedChoice,
  selectedChoices,
  onChange,
  onChangeMultiple,
  maxChoice,
  type = "default",
  className = "",
}: {
  label?: string;
  data: TChoice[];
  selectedChoice?: TChoice;
  selectedChoices?: TChoice[];
  onChange?: (choice: TChoice) => void;
  onChangeMultiple?: (choices: TChoice[]) => void;
  maxChoice?: number;
  className?: string;
} & ChoiceVariants) => {
  const renderLeftSide = (choice: TChoice) => {
    if (choice.leftIcon) {
      return <View className="mr-1.5">{choice.leftIcon}</View>;
    }

    return null;
  };

  const renderRightSide = (choice: TChoice) => {
    if (type === "secondary" && choice.secondaryText !== undefined) {
      return (
        <View className="flex-1 flex-row justify-end items-center">
          <Text className="text-accent font-medium">
            {choice.secondaryText}
          </Text>
        </View>
      );
    }

    if (type === "multipleChoice") {
      return (
        <View className="flex-1 flex-row justify-end items-center">
          {selectedChoices?.map((x) => x.text)?.includes(choice.text) ? (
            <IcCheckboxSelected size={24} />
          ) : (
            <IcCheckbox size={24} />
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View className={cn("gap-2", className)}>
      {label !== undefined && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}
      <View className="gap-2 mt-2">
        {data.map((choice) => {
          const selected =
            type === "multipleChoice"
              ? selectedChoices?.map((x) => x.text)?.includes(choice.text)
              : choice.text === selectedChoice?.text;
          return (
            <Pressable
              key={choice.text}
              className={choiceWrapper({ selected, type })}
              onPress={() => {
                if (type === "multipleChoice") {
                  const nonNullSelectedChoices = selectedChoices || [];
                  const isSelecting = !selectedChoices?.includes(choice);

                  if (
                    maxChoice !== undefined &&
                    isSelecting &&
                    nonNullSelectedChoices.length >= maxChoice
                  ) {
                    return;
                  }

                  onChangeMultiple?.(
                    isSelecting
                      ? [...nonNullSelectedChoices, choice]
                      : nonNullSelectedChoices.filter((c) => c !== choice),
                  );

                  return;
                }

                onChange?.(choice);
              }}
            >
              {renderLeftSide(choice)}
              <Text className={cn(choiceText({ type, selected }))}>
                {choice.text}
              </Text>
              {renderRightSide(choice)}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
