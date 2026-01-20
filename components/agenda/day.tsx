import { View, Pressable } from "react-native";
import Text from "@/components/text";
import cn from "@/utilities/cn";
import { clsx } from "clsx";

export type ActivityStatus = "orange" | "blue" | "green" | "grey";

interface DayProps {
  day: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  activities?: ActivityStatus[];
  onPress?: () => void;
}

const activityColorMap: Record<ActivityStatus, string> = {
  orange: "#FF9E69",
  blue: "#457CE2",
  green: "#3FA951",
  grey: "#424F65",
};

export function Day({
  day,
  isCurrentMonth = true,
  isToday = false,
  isSelected = false,
  activities = [],
  onPress,
}: DayProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        "size-8 items-center justify-center rounded-full relative",
        clsx({
          "bg-secondary": isSelected,
          "opacity-60": !isCurrentMonth,
        }),
      )}
    >
      {/* Activity indicators */}
      {activities.length > 0 && (
        <View
          className={cn(
            "absolute flex-row gap-0.75",
            clsx({
              "top-0": activities.length <= 2,
              "-top-0.5": activities.length === 3,
            }),
          )}
        >
          {activities.slice(0, 3).map((status, index) => (
            <View
              key={index}
              className="w-1.75 h-1.75 rounded-full border border-light"
              style={{ backgroundColor: activityColorMap[status] }}
            />
          ))}
        </View>
      )}

      {/* Day number */}
      <Text
        className={cn(
          "text-sm font-medium",
          clsx({
            "text-white": isSelected,
            "text-primary font-bold": isToday && !isSelected,
            "text-text": !isSelected && !isToday && isCurrentMonth,
            "text-subtleText": !isCurrentMonth,
          }),
        )}
      >
        {day}
      </Text>
    </Pressable>
  );
}
