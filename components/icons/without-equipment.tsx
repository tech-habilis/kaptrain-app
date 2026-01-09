import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface IcWithoutEquipmentProps {
  size?: number;
  color?: string;
}

const IcWithoutEquipment = ({ size = 32, color = "#727988" }: IcWithoutEquipmentProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M7.25933 27.2402C6.57249 27.2402 5.98451 26.9957 5.49539 26.5066C5.00628 26.0174 4.76172 25.4295 4.76172 24.7426L4.76172 7.25933C4.76172 6.57249 5.00628 5.98451 5.49539 5.49539C5.98451 5.00628 6.57249 4.76172 7.25933 4.76172L24.7426 4.76172C25.4295 4.76172 26.0174 5.00628 26.5066 5.49539C26.9957 5.98451 27.2402 6.57249 27.2402 7.25933L27.2402 24.7426C27.2402 25.4295 26.9957 26.0174 26.5066 26.5066C26.0174 26.9957 25.4295 27.2402 24.7426 27.2402L7.25933 27.2402ZM7.25933 24.7426L24.7426 24.7426L24.7426 7.25933L7.25933 7.25933L7.25933 24.7426Z"
        fill={color}
      />
      <Path
        d="M20.4182 11.582L11.5781 20.4212"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default IcWithoutEquipment;