import { ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import Text from "./text";

export const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export const AnimatedText = Animated.createAnimatedComponent(Text);
