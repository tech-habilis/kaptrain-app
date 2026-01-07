import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface IcBenchProps {
  size?: number;
  color?: string;
}

const IcBench = ({ size = 32, color = "#424F65" }: IcBenchProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M26.8333 7.76502C27.3884 7.30978 27.4695 6.49066 27.0142 5.93548C26.559 5.38029 25.7399 5.29926 25.1847 5.75451L26.009 6.75977L26.8333 7.76502ZM26.009 6.75977L25.1847 5.75451L12.0898 16.492L12.9141 17.4973L13.7384 18.5026L26.8333 7.76502L26.009 6.75977Z"
        fill={color}
      />
      <Path
        d="M27.8034 23.9649L26.5784 17.7298C26.56 17.636 26.4778 17.5684 26.3822 17.5684L10.9906 17.5684L5.6344 17.5684L4.45312 23.9649"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M10.5339 14.9922L3.35938 14.9922"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M19.4609 12.8594L24.118 17.5174"
        stroke={color}
        strokeWidth={2.6}
      />
    </Svg>
  );
};

export default IcBench;