import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface IcStairProps {
  size?: number;
  color?: string;
}

const IcStair = ({ size = 32, color = "#424F65" }: IcStairProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M9.20312 3.36523L9.20312 28.6426"
        stroke={color}
        strokeWidth={2.66}
        strokeLinecap="round"
      />
      <Path
        d="M23.3125 3.36523L23.3125 28.6426"
        stroke={color}
        strokeWidth={2.66}
        strokeLinecap="round"
      />
      <Path
        d="M9.17969 7.27539L23.0059 7.27539"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M9.17969 13.0938L23.0059 13.0938"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M9.17969 18.9121L23.0059 18.9121"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M9.17969 24.7266L23.0059 24.7266"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default IcStair;