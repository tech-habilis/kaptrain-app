import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function IcChatCheckDouble({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <G clipPath="url(#clip0_3034_34422)" fill="#fff">
        <Path d="M9.89 3.115a.386.386 0 00-.544-.006l-6.01 5.967L.653 6.412A.386.386 0 000 6.683c0 .1.038.197.108.27l2.956 2.934a.383.383 0 00.544 0L9.89 3.65a.38.38 0 000-.535z" />
        <Path d="M9.89.115a.386.386 0 00-.544-.006l-6.01 5.967L.653 3.412A.386.386 0 000 3.683c0 .1.038.197.108.27l2.956 2.934a.383.383 0 00.544 0L9.89.65a.38.38 0 000-.535z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3034_34422">
          <Path fill="#fff" d="M0 0H10V10H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcChatCheckDouble;
