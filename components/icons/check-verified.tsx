import * as React from "react";
import Svg, { Path } from "react-native-svg";

const RATIO = 53 / 48; // size from figma

const IcCheckVerified = ({ size = 53 }) => {
  return (
    <Svg width={size} height={size / RATIO} viewBox="0 0 53 48" fill="none">
      <Path
        d="M21.538 30.005L42.995 7.228a2.318 2.318 0 013.558 2.956L24.53 40.307a2.91 2.91 0 01-4.654.06l-12.37-16.05a2.43 2.43 0 013.642-3.206l8.956 8.917a1 1 0 001.434-.023z"
        fill="#fff"
      />
    </Svg>
  );
};

export default IcCheckVerified;
