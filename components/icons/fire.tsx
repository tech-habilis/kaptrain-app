import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcFire({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 8.001c1.333-1.973 0-4.666-.667-5.333 0 2.025-1.182 3.16-2 4C4.516 7.508 4 8.828 4 10.001a4 4 0 108 0c0-1.021-.704-2.626-1.333-3.333-1.191 2-1.861 2-2.667 1.333z"
        stroke="#424F65"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcFire;
