import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

function IcNoDataChart({ size = 80 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <G opacity={0.4}>
        <Path
          d="M50.902 69.8a32.097 32.097 0 00-7.54-61.793L41.53 22.554a17.436 17.436 0 014.096 33.566l5.276 13.68z"
          fill="#E5E5EB"
        />
        <Path
          d="M45.286 8.314A32.097 32.097 0 0012.85 57.966l12.105-8.272a17.435 17.435 0 0117.619-26.972l2.71-14.408z"
          fill="#457CE2"
        />
        <Path
          d="M7.33 42.062a32.097 32.097 0 0046 26.683l-6.385-13.198a17.435 17.435 0 01-24.988-14.495l-14.626 1.01z"
          fill="#06234B"
        />
      </G>
    </Svg>
  );
}

export default IcNoDataChart;
