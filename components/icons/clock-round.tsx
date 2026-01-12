import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcClockRound({ size = 14, color = "#424F65" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M6.65 12.648a6 6 0 100-12 6 6 0 000 12zM6.65 6.65l2 1.333m-2-4.667V6.65"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcClockRound;
