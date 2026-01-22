import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcChevronDown = ({ size = 24, color = "#424F65" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcChevronDown;