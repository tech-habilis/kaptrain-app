import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcWeight({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <G
        clipPath="url(#clip0_3034_33472)"
        stroke="#424F65"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M4.935 4.664H3.068a.4.4 0 00-.4.4v5.867a.4.4 0 00.4.4h1.867a.4.4 0 00.4-.4V5.064a.4.4 0 00-.4-.4zm8 0h-1.867a.4.4 0 00-.4.4v5.867a.4.4 0 00.4.4h1.867a.4.4 0 00.4-.4V5.064a.4.4 0 00-.4-.4z" />
        <Path d="M5.335 8h5.333m-10 1.6V6.4a.4.4 0 01.4-.4h1.2a.4.4 0 01.4.4v3.2a.4.4 0 01-.4.4h-1.2a.4.4 0 01-.4-.4zm14.667 0V6.4a.4.4 0 00-.4-.4h-1.2a.4.4 0 00-.4.4v3.2a.4.4 0 00.4.4h1.2a.4.4 0 00.4-.4z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3034_33472">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcWeight;
