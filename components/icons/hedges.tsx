import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IcHedgesProps {
  size?: number;
  color?: string;
}

const IcHedges = ({ size = 32, color = "#424F65" }: IcHedgesProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M24.2514 10.1018L24.2514 25.6986C24.2514 25.809 24.1619 25.8986 24.0514 25.8986L7.96563 25.8986C7.85517 25.8986 7.76562 25.809 7.76562 25.6986L7.76562 8.38281"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M7.81399 25.8642L4.19531 22.2461"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Rect
        x={3.43359}
        y={5.33984}
        width={25.1315}
        height={5.43622}
        rx={0.6}
        fill={color}
      />
    </Svg>
  );
};

export default IcHedges;