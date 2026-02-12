import { View, Pressable } from "react-native";
import Text from "@/components/text";
import IcArrowRight from "@/components/icons/arrow-right";
import { ColorConst } from "@/constants/theme";

export type SessionStatus = "completed" | "pending";

interface SessionCardProps {
  title: string;
  description: string;
  coachName: string;
  borderColor?: string;
  icon?: React.ReactNode;
  status?: SessionStatus;
  completedIcon?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function SessionCard({
  title,
  description,
  coachName,
  borderColor = ColorConst.primary,
  icon,
  status = "pending",
  completedIcon,
  onPress,
  onLongPress,
}: SessionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white border border-stroke rounded-[14px] flex-row items-center justify-between active:opacity-80"
    >
      <View
        className="pl-3 rounded-[14px] border-l-4 py-1.5 flex-1"
        style={{
          borderColor: borderColor,
        }}
      >
        {/* Title with icon */}
        <View className="flex-row gap-1 items-center">
          {status === "completed" && completedIcon ? completedIcon : icon}
          <Text className="font-bold">{title}</Text>
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
        <IcArrowRight size={24} color={ColorConst.accent} />
      </View>
    </Pressable>
  );
}
