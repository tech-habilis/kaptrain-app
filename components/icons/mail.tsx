import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcMail({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_3722_76401)">
        <Path
          d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
          fill="#424F65"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3722_76401">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcMail;
