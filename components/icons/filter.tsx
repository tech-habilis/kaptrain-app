import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcFilter({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.165 7.999H5.93m-2.908 0H1.832m1.19 0a1.453 1.453 0 112.906 0 1.453 1.453 0 01-2.907 0zm11.143 4.404h-3.832m0 0a1.455 1.455 0 01-2.907 0m2.907 0a1.453 1.453 0 00-2.907 0m0 0H1.832m12.333-8.809h-2.07m-2.907 0H1.832m7.356 0a1.453 1.453 0 112.907 0 1.453 1.453 0 01-2.907 0z"
        stroke="#424F65"
        strokeWidth={1.3}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default IcFilter;
