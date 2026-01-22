import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface IcBoxProps {
  size?: number;
  color?: string;
}

const IcBox = ({ size = 32, color = "#424F65" }: IcBoxProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M5.62243 9.11457L16.2773 5.60453C16.3178 5.59118 16.3615 5.59114 16.402 5.6044L26.9272 9.04793C26.9977 9.071 27.0496 9.13118 27.0621 9.20428L29.0538 20.843C29.0693 20.9337 29.0209 21.0233 28.9365 21.06L16.2127 26.6031L3.4256 20.871C3.341 20.8331 3.29355 20.742 3.31097 20.651L5.48857 9.26695C5.50221 9.19562 5.55345 9.13729 5.62243 9.11457Z"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M16.1562 24.998L16.0469 12.7402"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M16.1513 13.5394L6.66016 10.23L16.8525 6.02539L27.172 9.78278L16.1513 13.5394Z"
        fill={color}
      />
    </Svg>
  );
};

export default IcBox;