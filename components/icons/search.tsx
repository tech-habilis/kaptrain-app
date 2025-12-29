import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcSearch = ({ size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14 14l-2.9-2.9m1.567-3.767A5.333 5.333 0 112 7.333a5.333 5.333 0 0110.667 0z"
        stroke="#424F65"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcSearch;
