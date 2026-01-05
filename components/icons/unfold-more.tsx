import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcUnfoldMore({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_978_2487)">
        <Path
          d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"
          fill="#424F65"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_978_2487">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcUnfoldMore;
