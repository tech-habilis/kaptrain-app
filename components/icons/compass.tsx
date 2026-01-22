import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcCompass({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <G
        clipPath="url(#clip0_951_8197)"
        stroke="#424F65"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M8 14.665A6.667 6.667 0 108 1.332a6.667 6.667 0 000 13.333z" />
        <Path d="M10.826 5.172l-1.413 4.24-4.24 1.413 1.413-4.24 4.24-1.413z" />
      </G>
      <Defs>
        <ClipPath id="clip0_951_8197">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcCompass;
