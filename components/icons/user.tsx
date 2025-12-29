import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcUser = ({ size = 64 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M31.998 35.2c-18.944 0-25.6 9.6-25.6 16v9.6h51.2v-9.6c0-6.4-6.656-16-25.6-16zM32.002 32c7.953 0 14.4-6.448 14.4-14.4 0-7.954-6.447-14.4-14.4-14.4s-14.4 6.446-14.4 14.4c0 7.952 6.447 14.4 14.4 14.4z"
        fill="#727988"
      />
    </Svg>
  );
};

export default IcUser;
