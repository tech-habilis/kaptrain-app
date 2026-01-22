import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcRepeat({ size = 32, color = "#424F65" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 16c0 6.628 5.372 12 12 12s12-5.372 12-12c0-6.223-4.737-11.34-10.802-11.94C16.538 3.993 16 4.536 16 5.2c0 .663.54 1.192 1.197 1.275A9.6 9.6 0 1110.6 8.062V10a1.2 1.2 0 002.4 0V4.8a.8.8 0 00-.8-.8H7a1.2 1.2 0 000 2.4h1.8A11.988 11.988 0 004 16z"
        fill={color}
        stroke={color}
        strokeWidth={0.2}
      />
    </Svg>
  );
}

export default IcRepeat;

// aliases
export const IcReset = IcRepeat;
export const IcRefresh = IcRepeat;
