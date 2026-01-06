import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

interface IcAgendaProps {
  size?: number;
  color?: string;
}

const IcAgenda = ({ size = 32, color = "#727988" }: IcAgendaProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G clipPath="url(#clip0_agenda)">
        <Path
          d="M23 8H9C7.89543 8 7 8.89543 7 10V24C7 25.1046 7.89543 26 9 26H23C24.1046 26 25 25.1046 25 24V10C25 8.89543 24.1046 8 23 8Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20 6V10"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 6V10"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7 14H25"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_agenda">
          <Rect width={24} height={24} fill="white" transform="translate(4 4)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default IcAgenda;