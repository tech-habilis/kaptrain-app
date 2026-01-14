import { FlatList, Pressable, View, ViewStyle } from "react-native";
import Text from "./text";
import { tv, VariantProps } from "tailwind-variants";
import cn from "@/utilities/cn";
import IcCheckboxSelected from "./icons/checkbox-selected";
import IcCheckbox from "./icons/checkbox";
import IcRadio from "./icons/radio";
import IcRadioSelected from "./icons/radio-selected";
import { TChoice } from "@/types";
import { clsx } from "clsx";
import { useState } from "react";

const choiceWrapper = tv({
  base: "rounded-lg px-2 py-4 justify-center items-center",
  variants: {
    type: {
      default: "",
      secondary: "flex-row items-center px-4",
      multipleChoice: "flex-row items-center px-3",
      multipleChoiceWithoutIcon: "flex-row items-center px-3",
      radio: "flex-row items-center px-4",
    },
    selected: {
      true: "border-2 border-primary bg-light",
      false: "border-2 border-stroke",
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
      multipleChoiceWithoutIcon: "text-center",
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
      type: ["multipleChoice", "multipleChoiceWithoutIcon"],
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
  style,
}: {
  choice: TChoice;
  className?: string;
  textClassName?: string;
  selected: boolean;
  onPress: () => void;
  type: ChoiceVariants["type"];
  style?: ViewStyle;
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

    // multipleChoiceWithoutIcon doesn't render any icon

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
      style={style}
    >
      {renderLeftSide(choice)}
      <View className="max-w-[85%]">
        <Text className={cn(choiceText({ type, selected }), textClassName)}>
          {choice.text}
        </Text>
        {type === "radio" && choice.secondaryText && (
          <Text className="text-sm text-subtleText">
            {choice.secondaryText}
          </Text>
        )}
      </View>
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
  numColumns = 1,
  itemClassName = "",
  activeItemClassName = "",
  inactiveItemClassName = "",
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
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  itemTextClassName?: string;
} & Omit<ChoiceVariants, "selected">) => {
  const [width, setWidth] = useState(0);
  const gap = numColumns > 1 ? 8 : 0;
  const itemWidth = (width - gap) / numColumns;

  return (
    <View
      className={cn("gap-2", className)}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
    >
      {label !== undefined && (
        <Text className="text-accent font-medium text-sm">{label}</Text>
      )}

      <View className="gap-2 mt-2">
        {data.map((item, index) => (
          <Choice
            key={index}
            type={type}
            className={clsx(itemClassName, {
              [activeItemClassName]: selectedChoice?.text === item.text,
              [inactiveItemClassName]: selectedChoice?.text !== item.text,
            })}
            textClassName={itemTextClassName}
            style={{ width: itemWidth }}
            choice={item}
            selected={
              (type === "multipleChoice" || type === "multipleChoiceWithoutIcon"
                ? selectedChoices?.map((x) => x.text)?.includes(item.text)
                : item.text === selectedChoice?.text) || false
            }
            onPress={() => {
              if (
                type === "multipleChoice" ||
                type === "multipleChoiceWithoutIcon"
              ) {
                const nonNullSelectedChoices = selectedChoices || [];
                const isSelecting = !selectedChoices?.includes(item);

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
                    : nonNullSelectedChoices.filter((c) => c !== item),
                );

                return;
              }

              onChange?.(item);
            }}
          />
        ))}
      </View>
    </View>
  );
};
