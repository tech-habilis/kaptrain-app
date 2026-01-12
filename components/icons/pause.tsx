import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcPause({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 19V5h4v14h-4zm-8 0V5h4v14H6z" fill="#424F65" />
    </Svg>
  );
}

export default IcPause;
