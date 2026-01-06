import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcCalendar({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        clipPath="url(#clip0_1004_1312)"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" />
      </G>
      <Defs>
        <ClipPath id="clip0_1004_1312">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcCalendar;
