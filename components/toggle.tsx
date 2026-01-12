import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  value,
  onValueChange,
  disabled = false,
}: ToggleProps) {
  const translateX = useSharedValue(value ? 28 : 2);

  useEffect(() => {
    translateX.value = withSpring(value ? 30 : 4);
    }, [value, translateX]);

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`w-14 h-7 rounded-full justify-center ${
        value ? "bg-primary" : "bg-stroke"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Animated.View
        className="w-5.5 h-5.5 rounded-full bg-white"
        style={thumbStyle}
      />
    </Pressable>
  );
}
