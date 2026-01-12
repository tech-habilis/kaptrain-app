import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcLightningFilled({ size = 24, color = "#FF9E69" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.567 22a.703.703 0 01-.309-.071.735.735 0 01-.25-.202.778.778 0 01-.161-.624v-.005l1.118-6.43H5.636a.616.616 0 01-.34-.104.658.658 0 01-.234-.276.695.695 0 01.08-.707l8.717-11.288a.732.732 0 01.392-.268.703.703 0 01.467.034.746.746 0 01.352.324.8.8 0 01.093.481c0 .013-.003.025-.005.037l-1.122 6.433h4.328c.12 0 .238.036.34.103a.657.657 0 01.234.277.694.694 0 01-.08.706L10.14 21.708a.742.742 0 01-.255.215.707.707 0 01-.318.077z"
        fill={color}
      />
    </Svg>
  );
}

export default IcLightningFilled;
