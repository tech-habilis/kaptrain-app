import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcStar({ size = 29 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 29 29" fill="none">
      <G clipPath="url(#clip0_951_11604)">
        <Path
          d="M14.4 10.666l1.128 3.732h3.384l-2.724 1.944 1.116 3.612-2.904-2.208-2.904 2.208 1.116-3.612-2.724-1.944h3.384l1.128-3.732zm0-8.268l-2.904 9.6H2.4l7.404 5.292-2.808 9.108L14.4 20.77l7.416 5.628-2.82-9.108 7.404-5.292h-9.096l-2.904-9.6z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_951_11604">
          <Path fill="#fff" d="M0 0H28.8V28.8H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcStar;
