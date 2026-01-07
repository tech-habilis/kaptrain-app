import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcTrash({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_951_13754)">
        <Path
          d="M16 9v10H8V9h8zm-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
          fill="#E32828"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_951_13754">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcTrash;
