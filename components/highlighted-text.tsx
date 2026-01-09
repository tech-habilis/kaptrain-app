import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Text from "./text";
import { ComponentProps } from "react";
import { View } from "react-native";

const RATIO = 232 / 4;

function HighlightLine({ width = 232 }) {
  return (
    <View className="absolute bottom-0">
      <Svg width={width} height={width / RATIO} viewBox="0 0 232 4" fill="none">
        <Path d="M232 0l-11.904 4H0l2.382-4H232z" fill="#FF9E69" />
      </Svg>
    </View>
  );
}

export default function HighlightedText({
  ...textProps
}: ComponentProps<typeof Text>) {
  return (
    <View className="relative translate-y-3.75">
      <Text {...textProps} />
      <HighlightLine />
    </View>
  );
}
