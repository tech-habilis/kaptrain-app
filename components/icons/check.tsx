import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcCheck = ({ size = 24, color = "#424F65" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcCheck;
