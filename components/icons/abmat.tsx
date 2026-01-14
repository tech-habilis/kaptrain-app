import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcAbmat({ size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G clipPath="url(#clip0_8039_13777)">
        <Path
          d="M18.813 9.194l9.73 9.059-16.127 6.678-9.219-9.024c-.002-.002-.003-.007-.002-.01a9.189 9.189 0 019.701-7.325l5.442.415a.786.786 0 01.475.207z"
          stroke="#424F65"
          strokeWidth={2.6}
        />
        <Path
          d="M27.32 16.717l-6.958.35a8.137 8.137 0 00-7.724 7.896"
          stroke="#424F65"
          strokeWidth={2.66}
        />
        <Path
          d="M16.674 18.056l-3.194 5.136.556 1.458 12.67-5.172-.103-1.806-3.854-.797-6.075 1.18z"
          fill="#424F65"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_8039_13777">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcAbmat;
