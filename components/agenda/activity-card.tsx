import { View, Pressable } from "react-native";
import Text from "@/components/text";
import IcArrowRight from "@/components/icons/arrow-right";

export type ActivityType = "sport" | "preparation" | "other";

interface ActivityCardProps {
  title: string;
  description: string;
  coachName: string;
  activityType?: ActivityType;
  borderColor?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const activityColorMap: Record<ActivityType, string> = {
  sport: "#457CE2",
  preparation: "#FF9E69",
  other: "#424F65",
};

export function ActivityCard({
  title,
  description,
  coachName,
  activityType = "sport",
  borderColor,
  icon,
  onPress,
}: ActivityCardProps) {
  const leftBorderColor = borderColor || activityColorMap[activityType];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 border border-stroke rounded-xl active:opacity-80"
    >
      <View
        className="flex-1 py-1.5 pl-3 rounded-xl"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: leftBorderColor,
        }}
      >
        {/* Title with icon */}
        <View className="flex-row items-center gap-1">
          {icon && <View>{icon}</View>}
          <Text className="font-bold text-sm">{title}</Text>
        </View>

        {/* Description */}
        <Text className="text-subtleText text-xs mt-1">{description}</Text>

        {/* Coach name */}
        <Text className="text-text text-[10px] mt-0.5 italic">
          {coachName}
        </Text>
      </View>

      {/* Arrow icon */}
      <View className="mr-3">
        <IcArrowRight size={24} />
      </View>
    </Pressable>
  );
}