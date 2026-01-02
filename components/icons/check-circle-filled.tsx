import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const IcCheckCircleFilled = ({ size = 16, color = "#3FA951" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect
        x={1.33594}
        y={1.33203}
        width={13.3333}
        height={13.3333}
        rx={6.66667}
        fill={color}
      />
      <Path
        d="M11.64 5.574l-5 4.243-2.273-1.929"
        stroke="#fff"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcCheckCircleFilled;
