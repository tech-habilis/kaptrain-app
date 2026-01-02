import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const IcMessage = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_5637_147179)">
        <Path
          d="M4 4h16v12H5.17L4 17.17V4zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_5637_147179">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default IcMessage;
