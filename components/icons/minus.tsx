import React from "react";
import { Svg, Path } from "react-native-svg";

const IcMinus = ({ size = 24, color = "#424F65" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IcMinus;
