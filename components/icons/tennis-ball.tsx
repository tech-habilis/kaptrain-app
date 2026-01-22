import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcTennisBall({ size = 24, color = "#424F65" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.863 3.433a8.612 8.612 0 00-9.274 6.723m9.274-6.723a8.61 8.61 0 017.73 9.062m-7.73-9.062c2.742 3.789 2.082 8.992 7.73 9.062m0 0a8.613 8.613 0 01-6.806 7.927m0 0A8.608 8.608 0 013.588 10.157m10.2 10.265c-.018-7.725-6.403-6.309-10.2-10.266"
        stroke={color}
        strokeWidth={1.95}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcTennisBall;
