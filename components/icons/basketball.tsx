import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcBasketball = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9z"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.046 6.273C6.955 7.909 7.91 9.818 7.91 12c0 2.182-.955 4.091-2.864 5.727m13.909 0c-1.91-1.636-2.864-3.545-2.864-5.727 0-2.182.954-4.09 2.863-5.727M3 12h18m-9-9v18"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcBasketball;
