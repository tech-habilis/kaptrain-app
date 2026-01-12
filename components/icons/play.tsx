import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcPlay({ size = 24, color = "#000" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5.14v14l11-7-11-7z" fill={color} />
    </Svg>
  );
}

export default IcPlay;
