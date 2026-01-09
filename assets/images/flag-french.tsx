import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcFlagFrench({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M24 18a2.667 2.667 0 01-2.667 2.667H16V3.334h5.333A2.667 2.667 0 0124 6.001v12z"
        fill="#ED2939"
      />
      <Path
        d="M2.667 3.334A2.667 2.667 0 000 6.001v12a2.667 2.667 0 002.667 2.666H8V3.334H2.667z"
        fill="#002495"
      />
      <Path d="M8 3.334h8v17.333H8V3.334z" fill="#EEE" />
    </Svg>
  );
}

export default IcFlagFrench;
