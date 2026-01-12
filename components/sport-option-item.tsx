import { SportOption } from "@/types";
import cn from "@/utilities/cn";
import { Pressable, View } from "react-native";
import Text from "./text";
import IcCheckboxSelected from "./icons/checkbox-selected";
import IcCheckbox from "./icons/checkbox";
import IcRadioSelected from "./icons/radio-selected";
import IcRadio from "./icons/radio";

export default function SportOptionItem({
  sport,
  isSelected,
  isDisabled,
  onPress,
  isMultipleSelection = true,
}: {
  sport: SportOption;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  isMultipleSelection: boolean;
}) {
  const selectedIcon = isMultipleSelection ? (
    <IcCheckboxSelected size={24} />
  ) : (
    <IcRadioSelected size={24} />
  );

  const unselectedIcon = isMultipleSelection ? (
    <IcCheckbox size={24} />
  ) : (
    <IcRadio size={24} />
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled && !isSelected}
      className={cn(
        "h-12 flex-row items-center justify-between px-3 rounded-lg",
        isSelected
          ? "bg-light border-2 border-primary"
          : "bg-white border border-stroke",
      )}
    >
      <View className="flex-row items-center gap-1.5 flex-1">
        {sport.icon && <View className="shrink-0">{sport.icon}</View>}
        <Text className="text-text text-base font-medium">{sport.name}</Text>
      </View>
      <View className="shrink-0">
        {isSelected ? selectedIcon : unselectedIcon}
      </View>
    </Pressable>
  );
}
