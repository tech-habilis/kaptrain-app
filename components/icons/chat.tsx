import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcChat({ size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M28 15.333a11.173 11.173 0 01-1.2 5.067 11.333 11.333 0 01-10.133 6.267 11.173 11.173 0 01-5.067-1.2L4 28l2.533-7.6a11.173 11.173 0 01-1.2-5.067A11.333 11.333 0 0111.6 5.2 11.173 11.173 0 0116.667 4h.666A11.306 11.306 0 0128 14.667v.666z"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcChat;
