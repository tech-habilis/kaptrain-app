import * as React from "react";
import Svg, { Rect } from "react-native-svg";

function IcDashedCircle({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={1}
        y={1}
        width={22}
        height={22}
        rx={11}
        stroke="#04152D"
        strokeWidth={2}
        strokeDasharray="4 4"
        opacity={0.35}
      />
    </Svg>
  );
}

export default IcDashedCircle;
