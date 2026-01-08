import { View, Pressable, Text as RawText } from "react-native";
import Text from "@/components/text";
import Button from "@/components/button";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import IcClose from "@/components/icons/close";

interface TabataCardProps {
  /**
   * Timer type label (e.g., "Tabata")
   */
  timerType?: string;

  /**
   * Effort duration in seconds
   */
  effortSeconds?: number;

  /**
   * Rest duration in seconds
   */
  restSeconds?: number;

  /**
   * Total number of rounds
   */
  totalRounds?: number;

  /**
   * Current round (0-based)
   */
  currentRound?: number;

  /**
   * Current countdown time display (MM:SS format)
   */
  countdownTime?: string;

  /**
   * State of the timer
   */
  state?: "default" | "running" | "paused" | "completed";

  /**
   * Size variant
   */
  size?: "small" | "large";

  /**
   * Callback when close button is pressed
   */
  onClose?: () => void;

  /**
   * Callback when modify button is pressed
   */
  onModify?: () => void;

  /**
   * Callback when start button is pressed
   */
  onStart?: () => void;

  /**
   * Additional className for styling
   */
  className?: string;
}

export default function TabataCard({
  timerType = "Tabata",
  effortSeconds = 20,
  restSeconds = 10,
  totalRounds = 8,
  currentRound = 0,
  countdownTime = "00:20",
  state = "default",
  size = "large",
  onClose,
  onModify,
  onStart,
  className = "",
}: TabataCardProps) {
  // Format time parts for display
  const [minutes, seconds] = countdownTime.split(":");

  return (
    <View
      className={cn(
        "bg-light border border-stroke rounded-2xl p-4",
        size === "large" ? "gap-4" : "gap-3",
        className,
      )}
    >
      {/* Header Section */}
      <View className="gap-2">
        {/* Title Row */}
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-text">{timerType}</Text>
          {onClose && (
            <Pressable
              className="w-6 h-6 items-center justify-center"
              onPress={onClose}
            >
              <IcClose size={24} color={ColorConst.text} />
            </Pressable>
          )}
        </View>

        {/* Tags Row */}
        <View className="flex-row gap-2">
          <View className="bg-white border border-stroke rounded px-2 py-0.5">
            <Text className="text-sm text-accent">
              {`Effort ${effortSeconds}s`}
            </Text>
          </View>
          <View className="bg-white border border-stroke rounded px-2 py-0.5">
            <Text className="text-sm text-accent">
              {`Repos ${restSeconds}s`}
            </Text>
          </View>
          <View className="bg-white border border-stroke rounded px-2 py-0.5">
            <Text className="text-sm text-accent">
              {`${totalRounds} tours`}
            </Text>
          </View>
        </View>
      </View>

      {/* Timer Display Section */}
      <View className="items-center gap-4 flex-row justify-center">
        {/* Countdown */}
        <View className="flex-row justify-center items-center">
          <Text className="text-secondary font-semibold text-[32px]">
            {minutes}
          </Text>
          <RawText className="text-secondary font-semibold text-[32px]">:</RawText>
          <Text className="text-secondary font-semibold text-[32px]">
            {seconds}
          </Text>
        </View>

        {/* Round Counter */}
        <Text className="text-sm font-medium text-accent">
          {`Tours ${currentRound}/${totalRounds}`}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {onModify && (
          <Button
            text="Modifier"
            type="secondary"
            size="small"
            onPress={onModify}
            className="flex-1"
          />
        )}
        {onStart && (
          <Button
            text={
              state === "running"
                ? "Pause"
                : state === "paused"
                  ? "Reprendre"
                  : "C'est parti !"
            }
            type="primary"
            size="small"
            onPress={onStart}
            className="flex-1"
          />
        )}
      </View>
    </View>
  );
}
