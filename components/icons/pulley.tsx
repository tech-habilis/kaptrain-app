import * as React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

interface IcPulleyProps {
  size?: number;
  color?: string;
}

const IcPulley = ({ size = 32, color = "#424F65" }: IcPulleyProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle
        cx={15.999}
        cy={13.2061}
        r={5.33574}
        stroke={color}
        strokeWidth={2.6}
      />
      <Circle
        cx={15.9975}
        cy={13.3022}
        r={2.24754}
        fill={color}
      />
      <Path
        d="M10.9609 9.13249L10.0833 8.46945C10.0333 8.43165 10.0039 8.37258 10.0039 8.30988L10.0039 4.20391C10.0039 4.09345 10.0934 4.00391 10.2039 4.00391L21.7927 4.00391C21.9031 4.00391 21.9927 4.09345 21.9927 4.20391L21.9927 8.49197C21.9927 8.55468 21.9633 8.61375 21.9132 8.65155L21.1254 9.24681"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M24.7084 22.066L24.7084 10.2756C24.7084 8.48508 23.1192 7.11175 21.3477 7.37132"
        stroke={color}
        strokeWidth={2}
      />
      <Rect
        x={21.8711}
        y={19.8594}
        width={5.25391}
        height={8.51562}
        rx={2}
        fill={color}
      />
    </Svg>
  );
};

export default IcPulley;