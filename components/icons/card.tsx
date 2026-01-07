import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcCard({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_1054_1698)">
        <Path
          d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
          fill="#424F65"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1054_1698">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcCard;
