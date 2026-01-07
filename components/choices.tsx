import { FlatList, Pressable, View } from "react-native";
import Text from "./text";
import { tv, VariantProps } from "tailwind-variants";
import cn from "@/utilities/cn";
import IcCheckboxSelected from "./icons/checkbox-selected";
import IcCheckbox from "./icons/checkbox";
import IcRadio from "./icons/radio";
import IcRadioSelected from "./icons/radio-selected";

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
      radio: "flex-row items-center px-4",
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
      radio: "text-base font-medium",
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
    {
      type: "radio",
      className: "text-secondary",
    },
  ],
  defaultVariants: {
    type: "default",
    selected: false,
  },
});

type ChoiceVariants = VariantProps<typeof choiceWrapper>;

export const Choice = ({
  choice,
  className = "",
  textClassName = "",
  selected = false,
  onPress,
  type,
}: {
  choice: TChoice;
  className?: string;
  textClassName?: string;
  selected: boolean;
  onPress: () => void;
  type: ChoiceVariants["type"];
}) => {
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
          {selected ? (
            <IcCheckboxSelected size={24} />
          ) : (
            <IcCheckbox size={24} />
          )}
        </View>
      );
    }

    if (type === "radio") {
      return (
        <View className="flex-1 flex-row justify-end items-center">
          {selected ? <IcRadioSelected size={24} /> : <IcRadio size={24} />}
        </View>
      );
    }

    return null;
  };

  return (
    <Pressable
      className={cn(choiceWrapper({ selected, type }), "flex-1", className)}
      onPress={onPress}
    >
      {renderLeftSide(choice)}
      <Text className={cn(choiceText({ type, selected }), textClassName)}>
        {choice.text}
      </Text>
      {renderRightSide(choice)}
    </Pressable>
  );
};

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
  numColumns,
  itemClassName = "",
  itemTextClassName = "",
}: {
  label?: string;
  data: TChoice[];
  selectedChoice?: TChoice;
  selectedChoices?: TChoice[];
  onChange?: (choice: TChoice) => void;
  onChangeMultiple?: (choices: TChoice[]) => void;
  maxChoice?: number;
  className?: string;
  numColumns?: number;
  itemClassName?: string;
  itemTextClassName?: string;
} & ChoiceVariants) => {
  return (
    <View className={cn("gap-2", className)}>
      {label !== undefined && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}

      <FlatList
        key={`choices-${numColumns || ""}`}
        numColumns={numColumns}
        columnWrapperClassName="gap-2"
        contentContainerClassName="gap-2 mt-2"
        data={data}
        renderItem={({ item }) => (
          <Choice
            type={type}
            className={itemClassName}
            choice={item}
            textClassName={itemTextClassName}
            selected={
              (type === "multipleChoice"
                ? selectedChoices?.map((x) => x.text)?.includes(item.text)
                : item.text === selectedChoice?.text) || false
            }
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
                    ? [...nonNullSelectedChoices, item]
                    : nonNullSelectedChoices.filter((c) => c !== choice),
                );

                return;
              }

              onChange?.(item);
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
