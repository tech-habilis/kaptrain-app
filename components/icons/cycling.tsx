import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcCycling = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.248 20.343a3.365 3.365 0 100-6.73 3.365 3.365 0 000 6.73zM5.748 20.343a3.365 3.365 0 100-6.73 3.365 3.365 0 000 6.73zM15 6a1 1 0 100-2 1 1 0 000 2zM11.994 16.977v-3.365l-2.885-2.884 3.846-2.884 1.923 2.884H16.8"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcCycling;
