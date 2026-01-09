import * as React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

interface IcMassageRollerProps {
  size?: number;
  color?: string;
}

const IcMassageRoller = ({ size = 32, color = "#424F65" }: IcMassageRollerProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M22.1503 3.05905C24.012 2.556 25.9034 2.91322 27.402 3.88802"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M9.17057 29.2782C7.27448 29.6302 5.4179 29.1223 4.00234 28.0303"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Rect
        x={2.15865}
        y={18.4993}
        width={26.3946}
        height={9.65385}
        rx={4.82692}
        transform="rotate(-30 2.15865 18.4993)"
        stroke={color}
        strokeWidth={2.6}
      />
      <Circle
        cx={8.60744}
        cy={20.3496}
        r={4.68635}
        stroke={color}
        strokeWidth={2.6}
      />
      <Path
        d="M20.5674 19.0101C22.8192 17.5795 23.485 14.5943 22.0544 12.3424C20.6238 10.0906 17.6385 9.42487 15.3867 10.8555"
        stroke={color}
        strokeWidth={2.6}
      />
    </Svg>
  );
};

export default IcMassageRoller;