import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcInfoCircle = ({ size = 24, color = "#457CE2" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8.404h.007m-.007 7.2v-4.5m9 .9a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcInfoCircle;
