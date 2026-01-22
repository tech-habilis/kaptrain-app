import * as React from "react";
import Svg, { Path } from "react-native-svg";

const RATIO = 58 / 30; // size from figma

function IcThreeArrow({ size = 58 }) {
  return (
    <Svg width={size} height={size / RATIO} viewBox="0 0 58 30" fill="none">
      <Path
        opacity={0.25}
        d="M10.781 23.438L19.22 15 10.78 6.562"
        stroke="#424F65"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        opacity={0.5}
        d="M24.781 23.438L33.22 15 24.78 6.562"
        stroke="#424F65"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38.781 23.438L47.22 15 38.78 6.562"
        stroke="#424F65"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcThreeArrow;
