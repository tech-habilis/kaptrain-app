import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Text from "@/components/text";

export interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  title?: string;
}

export default function CircularProgress({
  current,
  total,
  size = 120,
  strokeWidth = 8,
  backgroundColor = "#F5F6FD",
  progressColor = "#04152D",
  title = "Pas",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress percentage
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
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

      {/* Center content */}
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text className="text-xs text-subtleText">{title}</Text>
        <Text className="text-sm font-semibold text-text mt-0.5">
          {current.toString()}
        </Text>
      </View>
    </View>
  );
}
