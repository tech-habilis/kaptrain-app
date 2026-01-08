import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Text from "@/components/text";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import cn from "@/utilities/cn";

export interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  title?: string;
  labelFontSize?: number;
  valueFontSize?: number;
  onChange?: (value: number) => void;
  textContainerClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export default function CircularProgress({
  current,
  total,
  size = 120,
  strokeWidth = 8,
  backgroundColor = "#F5F6FD",
  progressColor = "#04152D",
  title,
  labelFontSize = 12,
  valueFontSize = 14,
  onChange,
  textContainerClassName = "",
  labelClassName = "",
  valueClassName = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress percentage
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference * (1 - progress);

  // Calculate angle for thumb position (in degrees)
  const angle = progress * 360 - 90; // -90 to start from top
  const angleRad = (angle * Math.PI) / 180;
  const thumbX = center + radius * Math.cos(angleRad);
  const thumbY = center + radius * Math.sin(angleRad);

  // Calculate value from touch position
  const calculateValueFromPosition = (x: number, y: number) => {
    "worklet";
    const dx = x - center;
    const dy = y - center;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Adjust angle to start from top (0 degrees at top)
    angle = angle + 90;
    if (angle < 0) angle += 360;

    // Convert angle to progress (0 to 1)
    const newProgress = Math.min(Math.max(angle / 360, 0), 1);
    const newValue = Math.round(newProgress * total);

    return Math.min(Math.max(newValue, 0), total);
  };

  const handleValueChange = (value: number) => {
    if (onChange && value !== current) {
      onChange(value);
    }
  };

  const panGesture = Gesture.Pan().onChange((event) => {
    const newValue = calculateValueFromPosition(event.x, event.y);
    runOnJS(handleValueChange)(newValue);
  });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const newValue = calculateValueFromPosition(event.x, event.y);
    runOnJS(handleValueChange)(newValue);
  });

  const composedGesture = onChange
    ? Gesture.Race(panGesture, tapGesture)
    : Gesture.Race();

  return (
    <GestureDetector gesture={composedGesture}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        {/* Thumb indicator - only show if onChange is provided */}
        {onChange && progress > 0 && (
          <View
            style={{
              position: "absolute",
              left: thumbX - 12,
              top: thumbY - 12,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "white",
              borderWidth: 4,
              borderColor: progressColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          />
        )}

        {/* Center content */}
        <View className={cn("absolute items-center", textContainerClassName)}>
          {title && (
            <Text
              className={cn("text-subtleText", labelClassName)}
              style={{ fontSize: labelFontSize }}
            >
              {title}
            </Text>
          )}
          <Text
            className={cn("font-semibold text-text mt-0.5", valueClassName)}
            style={{ fontSize: valueFontSize }}
          >
            {current.toString()}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
}
