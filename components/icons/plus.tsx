import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcPlus = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6z" fill="#fff" />
    </Svg>
  );
};

export default IcPlus;
